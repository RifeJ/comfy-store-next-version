"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  HiOutlineCube,
  HiOutlineUsers,
  HiOutlineShoppingBag,
  HiOutlineArrowLeft,
} from "react-icons/hi2";
import { toast } from "react-toastify";
import { io } from "socket.io-client";

const socket = io("https://comfystorebackend-production.up.railway.app/api");

const getAuthHeaders = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers = {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
  console.log("SENDING_HEADERS:", headers);
  return headers;
};

const AdminDashboard = () => {
  const [items, setItems] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState("products");

  const fetchData = async (endpoint, setter) => {
    try {
      const response = await fetch(
        `https://comfystorebackend-production.up.railway.app/api/${endpoint}`,
        {
          headers: getAuthHeaders(),
        },
      );
      if (!response.ok) throw new Error("Auth failed");
      const result = await response.json();
      setter(result.data);
    } catch (err) {
      console.error(`Error loading ${endpoint}:`, err);
    }
  };

  const loadAll = async () => {
    setLoading(true);
    await Promise.all([
      fetchData("products", setItems),
      fetchData("users", setCustomers),
      fetchData("orders", setOrders),
    ]);
    setLoading(false);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.role === "admin") setIsAdmin(true);
    }
    loadAll();
    socket.on("DATABASE_SYNC_EVENT", loadAll);
    return () => socket.off("DATABASE_SYNC_EVENT");
  }, []);

  const handleTerminate = async (id) => {
    if (!window.confirm("TERMINATE UNIT?")) return;
    const response = await fetch(
      `https://comfystorebackend-production.up.railway.app/api/products/${id}`,
      {
        method: "DELETE",
        headers: getAuthHeaders(),
      },
    );
    if (response.ok) {
      toast.success("TERMINATED");
      loadAll();
    } else {
      toast.error("ACCESS_DENIED");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center font-mono">
        LOADING_CORE_SYSTEM...
      </div>
    );
  if (!isAdmin)
    return (
      <div className="p-10 text-error">
        ACCESS_DENIED: UNAUTHORIZED_PERSONNEL
      </div>
    );

  return (
    <div className="flex min-h-screen bg-base-300">
      <aside className="w-64 bg-base-200 p-6 flex flex-col border-r border-base-content/10">
        <div className="text-primary font-bold text-xl mb-10">CORE_OS v2.0</div>
        <nav className="space-y-2">
          {["products", "customers", "orders"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full p-3 rounded-xl text-sm ${activeTab === tab ? "bg-primary text-primary-content" : "text-base-content/60"}`}>
              {tab.toUpperCase()}
            </button>
          ))}
        </nav>
        <Link href="/" className="mt-auto text-sm text-base-content/50">
          EXIT_TERMINAL
        </Link>
      </aside>

      <main className="flex-1 p-10 overflow-y-auto">
        {activeTab === "products" && (
          // Вместо твоего текущего списка в activeTab === "products"
          <div className="bg-card border border-base-content/10 rounded-3xl shadow-lg overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-base-200/50 text-[10px] uppercase tracking-widest font-semibold border-b border-base-content/10">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Model Name</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-content/5 text-sm">
                {items.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-base-200/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-base-content/50">
                      #{item._id.slice(-6)}
                    </td>
                    <td className="px-6 py-4 font-semibold text-base-content">
                      {item.title}
                    </td>
                    <td className="px-6 py-4 font-medium text-primary">
                      ${item.price / 100}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleTerminate(item._id)}
                        className="text-error hover:bg-error/10 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors">
                        DELETE
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {activeTab === "customers" && (
          <div className="bg-card border border-base-content/10 rounded-3xl shadow-lg overflow-hidden animate-fade-in">
            <table className="w-full text-left">
              <thead className="bg-base-200/50 text-[10px] uppercase tracking-widest font-semibold border-b border-base-content/10">
                <tr>
                  <th className="px-6 py-4">User ID</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-content/5 text-sm">
                {customers.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-base-200/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-base-content/50">
                      #{user._id.slice(-6)}
                    </td>
                    <td className="px-6 py-4 font-semibold">
                      {user.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-primary">{user.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {activeTab === "orders" && (
          <div className="bg-card border border-base-content/10 rounded-3xl shadow-lg overflow-hidden animate-fade-in">
            <table className="w-full text-left">
              <thead className="bg-base-200/50 text-[10px] uppercase tracking-widest font-semibold border-b border-base-content/10">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">User Email</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-content/5 text-sm">
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-base-200/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-base-content/50">
                      #{order._id.slice(-6)}
                    </td>
                    <td className="px-6 py-4 text-base-content/70">
                      {order.user?.email || "Guest"}
                    </td>
                    <td className="px-6 py-4 font-medium text-primary">
                      ${order.total / 100}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded text-[10px] font-bold">
                        {order.status || "COMPLETED"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
