"use client";

import React, { useState } from "react";
import { storeCart } from "../services/storeCart";
import { toast } from "react-toastify";

import { IoShieldCheckmarkOutline } from "react-icons/io5";
import { LuRefreshCcw } from "react-icons/lu";

export default function Checkout() {
  const [address, setAddress] = useState("");
  const [showMap, setShowMap] = useState(false);
  const cartItems = storeCart((state) => state.cartItems);
  const removeCart = storeCart((state) => state.removeCart);

  const subtotal =
    cartItems?.reduce((acc, item) => acc + item.price * item.amount, 0) || 0;
  const shipping = 500;
  const tax = subtotal * 0.1;
  const orderTotal = subtotal + shipping + tax;

  const applyOrder = () => {
    removeCart();
    toast.success("Order successuful sended", {
      autoClose: 2000,
      draggable: true,
    });
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-8 py-20 border-b border-base-300">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="bg-card border border-primary/20 rounded-2xl p-6 shadow-md">
          <h1 className="text-xl font-semibold mb-5">Shipping Information</h1>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm text-primary/70 mb-2">
                First Name
              </label>
              <input
                className="w-full max-w-125 rounded-xl border border-primary/20 bg-secondary px-4 py-3 placeholder:text-primary/70 focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block text-sm text-primary/70 mb-2">
                Phone Number
              </label>
              <input
                className="w-full max-w-125 rounded-xl border border-primary/20 bg-secondary px-4 py-3 placeholder:text-primary/70 focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter your number"
              />
            </div>
            <div>
              <label className="block text-sm text-primary/70 mb-2">
                Address
              </label>
              <input
                className="w-full max-w-125 rounded-xl border border-primary/20 bg-secondary px-4 py-3 placeholder:text-primary/70 focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Enter your address"
              />
            </div>
          </div>
        </div>
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
          <button
            onClick={applyOrder}
            className="w-full bg-primary hover:bg-primary/95 font-semibold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group tracking-wider uppercase text-primary-content">
            Place your order
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
      </div>
    </div>
  );
}
