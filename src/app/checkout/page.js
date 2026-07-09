"use client";

import React, { useState } from "react";
import { storeCart } from "../services/storeCart";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation"; // ИСПРАВЛЕНО: импортируем роутер для редиректа

import { IoShieldCheckmarkOutline } from "react-icons/io5";
import { LuRefreshCcw } from "react-icons/lu";

export default function Checkout() {
  const router = useRouter(); // ИСПРАВЛЕНО: инициализируем роутер

  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cartItems = storeCart((state) => state.cartItems);
  const removeCart = storeCart((state) => state.removeCart);

  const subtotal =
    cartItems?.reduce((acc, item) => acc + item.price * item.amount, 0) || 0;
  const shipping = 500;
  const tax = subtotal * 0.1;
  const orderTotal = subtotal + shipping + tax;

  // ИСПРАВЛЕНО: теперь это полноценный handleSubmit для формы, принимающий event
  const handlePlaceOrder = async (e) => {
    e.preventDefault(); // Предотвращаем перезагрузку страницы браузером

    if (!firstName.trim() || !phone.trim() || !address.trim()) {
      toast.error("Please fill in all shipping information");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to place an order");
      return;
    }

    setIsSubmitting(true);

    const orderData = {
      cartItems: cartItems.map((item) => ({
        productId: item.productID,
        quantity: item.amount,
      })),
      shippingAddress: `Name: ${firstName}, Phone: ${phone}, Address: ${address}`,
    };

    try {
      const response = await fetch(
        "https://comfystorebackend-production.up.railway.app/api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(orderData),
        },
      );

      if (response.ok) {
        removeCart();
        toast.success("Order successfully sent! 🚀", { autoClose: 2000 });

        // ИСПРАВЛЕНО: перенаправляем пользователя на страницу его заказов
        router.push("/orders");
      } else {
        const err = await response.json();
        toast.error(`Order failed: ${err.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Order submission error:", error);
      toast.error("Server connection error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="mx-auto w-full max-w-7xl px-8 py-20 border-b border-base-300">
        <h1 className="text-3xl font-medium tracking-wider">
          Your Cart is Empty
        </h1>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl w-full px-8 py-20">
      <div className="border-b border-base-300 pb-5 flex justify-between items-end mb-8">
        <h1 className="text-5xl font-bold tracking-wider">Checkout</h1>
      </div>

      {/* ИСПРАВЛЕНО: Оборачиваем всю сетку в тег <form> */}
      <form
        onSubmit={handlePlaceOrder}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Левая колонка: Инпуты */}
        <div className="bg-card border border-primary/20 rounded-2xl p-6 shadow-md">
          <h1 className="text-xl font-semibold mb-5">Shipping Information</h1>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm text-primary/70 mb-2">
                First Name
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full max-w-125 rounded-xl border border-primary/20 bg-secondary px-4 py-3 placeholder:text-primary/70 focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter your name"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm text-primary/70 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full max-w-125 rounded-xl border border-primary/20 bg-secondary px-4 py-3 placeholder:text-primary/70 focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter your number"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm text-primary/70 mb-2">
                Address
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full max-w-125 rounded-xl border border-primary/20 bg-secondary px-4 py-3 placeholder:text-primary/70 focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter your address"
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>

        {/* Правая колонка: Итоги */}
        <div className="bg-card border border-primary/20 rounded-2xl p-6 shadow-md space-y-6">
          <h1 className="text-xl font-bold tracking-tight border-b border-primary/20 pb-4">
            Order Summary
          </h1>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-primary/70">Subtotal</span>
              <span className="font-medium">
                {(subtotal / 100).toFixed(2)}$
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-primary/70">Shipping</span>
              <span className="font-medium">
                {(shipping / 100).toFixed(2)}$
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-primary/70">Tax</span>
              <span className="font-medium">{(tax / 100).toFixed(2)}$</span>
            </div>
            <div className="h-px bg-primary/20 my-2"></div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">Order Total</span>
              <span className="text-2xl font-bold">
                {(orderTotal / 100).toFixed(2)}$
              </span>
            </div>
          </div>

          {/* ИСПРАВЛЕНО: Кнопка теперь имеет type="submit", а обработчик сидит на форме */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary/95 font-semibold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group tracking-wider uppercase text-primary-content disabled:opacity-50 disabled:cursor-not-allowed">
            {isSubmitting ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-content border-t-transparent"></div>
            ) : (
              "Place your order"
            )}
          </button>

          <div className="pt-4 border-t border-primary/20 flex flex-col gap-3">
            <div className="flex items-center gap-3 text-xs text-primary/70">
              <IoShieldCheckmarkOutline
                size={14}
                className="text-emerald-500"
              />
              <p>Secure Checkout with SSL Encryption</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-primary/70">
              <LuRefreshCcw size={14} className="text-emerald-500" />
              <p>30-Day Premium Return Policy</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
