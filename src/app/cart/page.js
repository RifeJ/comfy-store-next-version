"use client";

import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { storeCart } from "../services/storeCart";
import { fetchAllProducts } from "../services/axios";
import Link from "next/link";
import { toast } from "react-toastify";
import { IoTrashOutline } from "react-icons/io5";
import { FaMinus } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { CiCreditCard1 } from "react-icons/ci";
import { IoShieldCheckmarkOutline } from "react-icons/io5";
import { LuRefreshCcw } from "react-icons/lu";
import ServerErrorBlock from "../components/ServerErrorBlock";

function Cart() {
  const [isMounted, setIsMounted] = useState(false);
  const [user, setUser] = useState(null);

  const { data: p = [], error } = useQuery({
    queryKey: ["stock"],
    queryFn: fetchAllProducts,
  });

  if (error) return <ServerErrorBlock />;

  const cartItems = storeCart((state) => state.cartItems);
  const removeFromCart = storeCart((state) => state.removeFromCart);
  const editAmount = storeCart((state) => state.editAmount);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setIsMounted(true);

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const items = isMounted ? cartItems : [];

  const handleRemove = (id) => {
    removeFromCart(id);
    toast.error("Item removed");
  };

  const subtotal =
    cartItems?.reduce((acc, item) => acc + item.price * item.amount, 0) || 0;
  const shipping = 500;
  const tax = subtotal * 0.1;
  const orderTotal = subtotal + shipping + tax;

  if (!isMounted) {
    return;
  }

  if (!items || items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-8 py-20 border-b border-base-300">
        <h1 className="text-3xl font-medium tracking-wider">
          Your Cart is Empty
        </h1>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl w-full px-8 py-20">
      <div className="border-b border-base-300 pb-5 flex justify-between items-end mb-8">
        <h1 className="text-5xl font-bold tracking-wider">Shopping Cart</h1>
        <p className="text-primary/80 text-sm">
          You have{" "}
          <span className="text-primary font-semibold">
            {cartItems.length} item
          </span>{" "}
          in your cart
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
          {cartItems.map((item) => {
            const { title, price, company, image, color, amount, cartID } =
              item;
            const stock = 10;

            return (
              <article
                key={cartID}
                className="bg-card border border-primary/20 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="flex items-center gap-6 w-full sm:w-auto">
                  <img
                    src={image}
                    alt={title}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden border border-primary/20 shrink-0 relative group"
                  />
                  <div className="space-y-2">
                    <h3 className="text-lg sm:text-xl font-bold leading-tight">
                      {title}
                    </h3>
                    <p className="text-xs text-primary/80 font-medium uppercase tracking-wider">
                      Company : {company}
                    </p>
                    <p className="flex items-center gap-2 pt-1">
                      Color :
                      <span
                        style={{ backgroundColor: color }}
                        className="w-5 h-5 rounded-full border border-primary/20 shadow-sm "></span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-row sm:flex-col md:flex-row items-center justify-between sm:justify-end gap-6 sm:gap-8 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-primary/20">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] text-primary/80 font-semibold uppercase tracking-wider">
                      Amount
                    </label>
                    <div className="flex justify-center items-center bg-secondary p-1 rounded-lg">
                      <button
                        onClick={() =>
                          editAmount(cartID, Math.max(1, amount - 1))
                        }
                        disabled={amount <= 1}
                        className="disabled:opacity-30">
                        <FaMinus />
                      </button>

                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => {
                          const val = Number(e.target.value);

                          if (e.target.value === "") {
                            editAmount(cartID, "");
                          } else {
                            editAmount(cartID, val < 1 ? 1 : val);
                          }
                        }}
                        onBlur={() => {
                          if (!amount || amount < 1) editAmount(cartID, 1);
                          if (amount >= stock) editAmount(cartID, stock);
                        }}
                        className="w-15 text-center"
                      />

                      <button
                        onClick={() => editAmount(cartID, Number(amount + 1))}
                        disabled={amount >= stock}
                        className="disabled:opacity-30">
                        <FaPlus />
                      </button>
                    </div>
                  </div>
                  <div className="text-right flex flex-col justify-center items-end gap-1.5">
                    <p className="text-xs text-primary/80 font-semibold uppercase tracking-wider">
                      Price
                    </p>
                    <p className="text-xl font-heading font-bold">
                      ${(price / 100).toFixed(2)}
                    </p>
                    <button
                      onClick={() => handleRemove(item.cartID)}
                      className="text-xs text-red-500 hover:text-red-500/80 font-semibold flex items-center gap-1 transition-all mt-1 group">
                      <IoTrashOutline /> Remove
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
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
          {user ? (
            <Link
              href={"/checkout"}
              className="w-full bg-primary hover:bg-primary/95 font-semibold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group tracking-wider uppercase text-primary-content">
              Proceed to Checkout <CiCreditCard1 size={25} />
            </Link>
          ) : (
            <Link
              href="/login"
              className="btn btn-primary btn-block mt-8 uppercase">
              please log in
            </Link>
          )}
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

export default Cart;
