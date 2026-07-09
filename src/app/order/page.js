"use client";

import React, { useEffect, useState } from "react";
import ReviewModal from "../components/ReviewModal";
import { toast } from "react-toastify";

export default function OrderPage() {
  const [orders, setOrders] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Please login to see your orders");
          setIsLoading(false);
          return;
        }

        const response = await fetch(
          "https://comfystorebackend-production.up.railway.app/api/orders/myOrders",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        } else {
          const err = await response.json();
          toast.error(`Failed to load orders: ${err.message}`);
        }
      } catch (err) {
        console.error(err);
        toast.error("Server connection error");
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleReviewClick = (product, orderId) => {
    setSelectedProduct({
      id: product.productId,
      name: product.name,
      orderId: orderId,
    });
    setIsModalOpen(true);
  };

  console.log(orders);

  const handleReviewSubmit = async (reviewData) => {
    try {
      const response = await fetch(
        "https://comfystorebackend-production.up.railway.app/api/reviews",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            productID: selectedProduct.id,
            rating: reviewData.rating,
            comment: reviewData.comment,
          }),
        },
      );

      if (response.ok) {
        toast.success("Review submitted successfully! Thanks bro!");
      } else {
        const err = await response.json();
        toast.error(`Error: ${err.message}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadge = (status) => {
    const base = "px-3 py-1 rounded-full text-xs font-semibold capitalize ";
    switch (status) {
      case "delivered":
        return base + "bg-green-100 text-green-800";
      case "processing":
        return base + "bg-blue-100 text-blue-800";
      case "pending":
        return base + "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return base + "bg-red-100 text-red-800";
      default:
        return base + "bg-gray-100 text-gray-800";
    }
  };

  const date = new Date(Date).toLocaleTimeString;

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen">
      <h1 className="text-3xl font-bold text-primary mb-8">Your Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-primary-content rounded-xl shadow-sm border border-primary/20 overflow-hidden">
            <div className="bg-primary-content p-4 border-b border-primary/20 flex flex-wrap justify-between items-center gap-4">
              <div className="flex gap-6 text-sm text-primary">
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                    Order Placed
                  </p>
                  <p className="font-medium text-primary">{date}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                    Total Amount
                  </p>
                  <p className="font-medium text-primary">
                    ${(order.totalAmount / 100).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                    Order ID
                  </p>
                  <p className="font-mono text-primary">#{order._id}</p>
                </div>
              </div>
              <div>
                <span className={getStatusBadge(order.status)}>
                  {order.status}
                </span>
              </div>
            </div>

            <div className="divide-y divide-primary/20">
              {order.products.map((item) => (
                <div
                  key={item.productId}
                  className="p-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg border border-primary/20"
                    />
                    <div>
                      <h4 className="font-semibold text-primary hover:text-indigo-600 cursor-pointer transition">
                        {item.name}
                      </h4>
                      <p className="text-sm text-primary/70">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-sm font-medium text-primary mt-1">
                        ${(item.price / 100).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div>
                    {order.status === "delivered" ? (
                      <button
                        onClick={() => handleReviewClick(item, order._id)}
                        className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg text-sm font-medium hover:bg-primary/10 transition duration-200">
                        Write a Review
                      </button>
                    ) : (
                      <button
                        disabled
                        className="px-4 py-2 bg-primary/30 text-primary/90 rounded-lg text-sm font-medium cursor-not-allowed">
                        Review Unavailable
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productName={selectedProduct?.name}
        onSubmit={handleReviewSubmit}
      />
    </div>
  );
}
