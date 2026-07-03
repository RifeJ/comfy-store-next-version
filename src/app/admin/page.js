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

const Typewriter = ({ text, speed = 100 }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let i = 0;
    setDisplayedText("");
    const typingInterval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, speed);
    return () => clearInterval(typingInterval);
  }, [text, speed]);

  return (
    <h1 className="text-[#FF69B4] font-mono text-2xl tracking-[0.2em] uppercase">
      {displayedText}
      <span className="animate-pulse">_</span>
    </h1>
  );
};

const AdminDashboard = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchItems = async () => {
    try {
      const response = await fetch(
        "https://comfystorebackend-production.up.railway.app/api/products",
      );
      const result = await response.json();
      setItems(result.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user.role === "admin") {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error("Error parsing user for AdminFab:", error);
      }
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    socket.on("DATABASE_SYNC_EVENT", () => {
      console.log("SYNC_SIGNAL_RECEIVED: REFRESHING_GRID");
      fetchItems();
    });

    return () => socket.off("DATABASE_SYNC_EVENT");
  }, []);

  const [newProduct, setNewProduct] = useState({
    title: "",
    price: "",
    category: "",
    description: "",
    company: "",
    image: "",
    images: "",
    colors: "",
    featured: false,
    shipping: false,
    stock: "",
  });

  const handleCreate = async (e) => {
    e.preventDefault();

    const payload = {
      ...newProduct,
      price: Number(newProduct.price),
      featured: Boolean(newProduct.featured),
      shipping: Boolean(newProduct.shipping),
      colors:
        typeof newProduct.colors === "string"
          ? newProduct.colors.split(",").map((c) => c.trim())
          : newProduct.colors,
    };

    const key = process.env.ADMIN_KEY; // undefinded

    try {
      const response = await fetch(
        "https://comfystorebackend-production.up.railway.app/api/products",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "admin-key": `werd`,
          },
          body: JSON.stringify(payload),
        },
      );

      const result = await response.json();

      if (response.ok) {
        console.log(key);
        setItems((prevItems) => [...prevItems, result.data]);

        setNewProduct({
          title: "",
          price: "",
          company: "",
          description: "",
          category: "",
          image: "",
          images: [],
          featured: false,
          shipping: false,
          colors: [],
          stock: "",
        });

        toast.success("SUCCESS: UNIT_SYNCED_WITH_GRID");
      } else {
        toast.error(`REJECTED:${result.error}`);
      }
    } catch (err) {
      toast.error(`CONNECTION_LOST:${err}`);
      console.error(err);
    }
  };

  const handleTerminate = async (id) => {
    const isConfirmed = window.confirm(
      "CRITICAL_ALERT: Are you sure you want to terminate this unit? This operation is permanent and cannot be undone.",
    );
    if (!isConfirmed === true) return;
    try {
      const response = await fetch(
        `https://comfystorebackend-production.up.railway.app/api/products/${id}`,
        {
          method: "DELETE",
          headers: {
            "admin-key": "werd",
          },
        },
      );

      if (response.ok) {
        setTimeout(() => {
          setItems((prev) => prev.filter((item) => item._id !== id));
        }, 600);

        console.log(`UNIT_${id}: TERMINATED_SUCCESSFULLY`);
      } else {
        alert("ACCESS_DENIED: DATABASE_REJECTED_COMMAND");
      }
    } catch (error) {
      console.error("UPLINK_ERROR:", error);
      alert("SYSTEM_ERROR: COULD_NOT_REACH_DATABASE");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-[#FF69B4] font-mono animate-pulse">
        &gt; CONNECTING_TO_CORE_DATABASE...
      </div>
    );

  if (!isAdmin) return null;

  return (
    <div className="relative flex min-h-screen bg-[#0a0a0a] text-slate-300 font-mono overflow-hidden">
      <div className="pointer-events-none absolute inset-0 z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-size-[100%_4px,3px_100%] opacity-50"></div>

      <aside className="w-64 border-r border-[#FF69B4]/20 bg-[#0f0f0f] p-6 flex flex-col z-10">
        <div className="mb-10 text-[#FF69B4] font-bold text-xl tracking-tighter border-b border-[#FF69B4]/20 pb-4">
          CORE_OS v1.0
        </div>

        <nav className="flex-1 space-y-4">
          <button className="flex items-center gap-3 text-[#FF69B4] w-full p-2 bg-[#FF69B4]/10 rounded border-l-2 border-[#FF69B4]">
            <HiOutlineCube /> PRODUCTS
          </button>
          <button className="flex items-center gap-3 hover:text-[#FF69B4] w-full p-2 transition-colors">
            <HiOutlineUsers /> CUSTOMERS
          </button>
          <button className="flex items-center gap-3 hover:text-[#FF69B4] w-full p-2 transition-colors">
            <HiOutlineShoppingBag /> ORDERS
          </button>
        </nav>

        <Link
          href="/"
          className="flex items-center gap-2 text-xs text-slate-500 hover:text-white transition-colors mt-auto pt-4">
          <HiOutlineArrowLeft /> EXIT_TERMINAL
        </Link>
      </aside>

      <main className="flex-1 p-10 overflow-y-auto z-10 relative">
        <header className="mb-10">
          <Typewriter text="SYSTEM_OVERVIEW_v2.0" speed={70} />
          <div className="h-1 w-20 bg-[#FF69B4] mt-2 shadow-[0_0_10px_#FF69B4]"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="border border-[#FF69B4]/30 bg-[#FF69B4]/5 p-4 rounded-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#FF69B4]"></div>
              <div className="text-[10px] text-slate-500 uppercase tracking-widest">
                Total_Assets
              </div>
              <div className="text-2xl font-bold text-white mt-1">
                {items.length}{" "}
                <span className="text-xs text-[#FF69B4]">UNITS</span>
              </div>
            </div>

            <div className="border border-blue-500/30 bg-blue-500/5 p-4 rounded-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
              <div className="text-[10px] text-slate-500 uppercase tracking-widest">
                Link_Status
              </div>
              <div className="text-2xl font-bold text-white mt-1">ACTIVE</div>
            </div>

            <div className="border border-green-500/30 bg-green-500/5 p-4 rounded-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
              <div className="text-[10px] text-slate-500 uppercase tracking-widest">
                System_Health
              </div>
              <div className="text-2xl font-bold text-white mt-1">98%</div>
            </div>
          </div>
        </header>

        <div className="mb-6 flex items-end gap-1 h-10 px-2 border-b border-slate-800">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="w-full bg-[#FF69B4]/20"
              style={{
                height: `${Math.floor(Math.random() * 80) + 20}%`,
                animation: `pulse-bar ${0.5 + Math.random()}s infinite alternate`,
              }}></div>
          ))}
        </div>

        <div className="bg-[#111]/80 border border-slate-800 p-6 rounded-lg backdrop-blur-sm">
          <h2 className="text-[#FF69B4] font-bold mb-6 flex items-center gap-2 uppercase tracking-tighter">
            <span className="w-2 h-2 bg-[#FF69B4] rounded-full animate-ping"></span>
            Active_Inventory_Stream
          </h2>
          <div className="mb-10 p-6 border border-[#FF69B4]/20 bg-[#111]/50 backdrop-blur-md">
            <h3 className="text-[#FF69B4] text-xs mb-4 tracking-[0.3em] font-bold">
              &gt; INITIALIZE_NEW_UNIT
            </h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <input
                  placeholder="TITLE"
                  className="admin-input"
                  value={newProduct.title}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, title: e.target.value })
                  }
                />
                <input
                  placeholder="PRICE"
                  type="number"
                  className="admin-input text-[#FF69B4]"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, price: e.target.value })
                  }
                />

                <input
                  placeholder="CATEGORY"
                  className="admin-input"
                  value={newProduct.category}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, category: e.target.value })
                  }
                />
                <input
                  placeholder="COMPANY"
                  className="admin-input"
                  value={newProduct.company}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, company: e.target.value })
                  }
                />
                <input
                  placeholder="IMAGE_URL"
                  className="admin-input w-full"
                  value={newProduct.image}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, image: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="COLORS (e.g. #ff0000, #000000)"
                  className="admin-input"
                  value={newProduct.colors}
                  onChange={(e) => {
                    const colorsArray = e.target.value
                      .split(",")
                      .map((color) => color.trim());
                    setNewProduct({ ...newProduct, colors: colorsArray });
                  }}
                />
                <input
                  type="text"
                  placeholder="EXTRA IMAGES_URL"
                  className="admin-input"
                  value={newProduct.images}
                  onChange={(e) => {
                    const imagesArray = e.target.value
                      .split(",")
                      .map((img) => img.trim());
                    setNewProduct({ ...newProduct, images: imagesArray });
                  }}
                />
                <input
                  placeholder="STOCK"
                  className="admin-input w-full"
                  value={newProduct.stock}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, stock: e.target.value })
                  }
                />
                <textarea
                  placeholder="DESCRIPTION"
                  className="admin-input lg:col-span-2"
                  value={newProduct.description}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex gap-10 text-[10px] tracking-widest text-slate-500">
                <label className="flex items-center gap-2 cursor-pointer hover:text-[#FF69B4]">
                  <input
                    type="checkbox"
                    checked={newProduct.featured}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        featured: e.target.checked,
                      })
                    }
                  />
                  FEATURED_UNIT
                </label>
                <label className="flex items-center gap-2 cursor-pointer hover:text-[#FF69B4]">
                  <input
                    type="checkbox"
                    checked={newProduct.shipping}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        shipping: e.target.checked,
                      })
                    }
                  />
                  FREE_SHIPPING
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-4 border border-[#FF69B4] text-[#FF69B4] hover:bg-[#FF69B4] hover:text-black transition-all uppercase font-bold">
                EXECUTE_DATA_INJECTION
              </button>
              <button
                onClick={fetchItems}
                className="text-xs text-[#FF69B4] border border-[#FF69B4] p-1 hover:bg-[#FF69B4] hover:text-black">
                [ SYNC_WITH_ATLAS ]
              </button>
            </form>
          </div>

          <div className="w-full bg-[#111]/80 border border-slate-800 rounded-lg mt-6 text-sm">
            <div className="grid grid-cols-[15%_45%_20%_20%] border-b border-slate-800 text-slate-500 text-[10px] tracking-widest uppercase bg-black/40 py-4 px-6">
              <div>UID</div>
              <div>Model_Name</div>
              <div>Price_Credits</div>
              <div className="text-right">Action</div>
            </div>
            <div className="divide-y divide-slate-950">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="grid grid-cols-4 items-center py-4 px-6 hover:bg-[#FF69B4]/5 transition-all">
                  <div className="font-mono text-slate-500 truncate">
                    #{item._id.slice(-6)}
                  </div>
                  <div className="font-bold text-white uppercase tracking-wide truncate">
                    {item.title || "UNKNOWN_UNIT"}
                  </div>
                  <div className="text-[#FF69B4] font-mono font-semibold">
                    ${item.price}
                  </div>
                  <div className="text-right">
                    <button
                      onClick={() => handleTerminate(item._id)}
                      className="text-red-500 hover:text-white hover:bg-red-600/80 px-3 py-1.5 text-[10px] border border-red-900 transition-all font-mono tracking-wider font-bold rounded-sm cursor-pointer inline-block">
                      [ TERMINATE ]
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
