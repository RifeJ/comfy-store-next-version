"use client";

import React, { useEffect, useState } from "react";
import storeCart from "../services/storeCart";
import Link from "next/link";
import { toast } from "react-toastify";

function Cart() {
  const [isMounted, setIsMounted] = useState(false);

  const cartItems = storeCart((state) => state.cartItems);
  const removeFromCart = storeCart((state) => state.removeFromCart);
  const editAmount = storeCart((state) => state.editAmount);

  useEffect(() => {
    setIsMounted(true);
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
      <div className="mx-auto max-w-6xl px-8 py-20 border-b border-base-300">
        <h1 className="text-3xl font-medium tracking-wider">
          Your Cart is Empty
        </h1>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-8 py-20">
      <div className="border-b border-base-300 pb-5">
        <h1 className="text-3xl font-medium tracking-wider">Shopping Cart</h1>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          {cartItems.map((item) => {
            const { title, price, company, image, color, amount, cartID } =
              item;
            return (
              <article
                key={cartID}
                className="mb-12 flex flex-col gap-y-4 sm:flex-row flex-wrap border-b border-base-300 pb-6 last:border-b-0">
                <img
                  src={image}
                  alt={title}
                  className="h-24 w-24 rounded-lg sm:h-32 sm:w-32 object-cover"
                />

                <div className="sm:ml-16 sm:w-48">
                  <h3 className="capitalize font-medium">{title}</h3>
                  <p className="mt-2 capitalize text-sm text-neutral-content">
                    {company}
                  </p>
                  <p className="mt-4 text-sm capitalize flex items-center gap-x-2">
                    Color :
                    <span
                      style={{ backgroundColor: color }}
                      className="w-6 h-6 rounded-full border"></span>
                  </p>
                </div>

                <div className="sm:ml-12">
                  <label className="label p-0 text-xs">Amount</label>
                  <select
                    value={amount}
                    className="mt-2 select select-bordered select-xs"
                    onChange={(e) =>
                      editAmount(cartID, Number(e.target.value))
                    }>
                    {[...Array(amount + 5).keys()].map((i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleRemove(item.cartID)}
                    className="mt-2 block link link-primary link-hover text-sm text-error">
                    remove
                  </button>
                </div>

                <p className="font-medium sm:ml-auto">
                  ${(price / 100).toFixed(2)}
                </p>
              </article>
            );
          })}
        </div>

        <div className="lg:col-span-4 lg:pl-4">
          <div className="card bg-base-200">
            <div className="card-body">
              <p className="flex justify-between text-xs border-b border-base-300 pb-2">
                <span>Subtotal</span>
                <span className="font-medium">
                  ${(subtotal / 100).toFixed(2)}
                </span>
              </p>
              <p className="flex justify-between text-xs border-b border-base-300 pb-2">
                <span>Shipping</span>
                <span className="font-medium">
                  ${(shipping / 100).toFixed(2)}
                </span>
              </p>
              <p className="flex justify-between text-xs border-b border-base-300 pb-2">
                <span>Tax</span>
                <span className="font-medium">${(tax / 100).toFixed(2)}</span>
              </p>
              <p className="flex justify-between text-sm mt-4 pb-2">
                <span className="font-bold">Order Total</span>
                <span className="font-bold">
                  ${(orderTotal / 100).toFixed(2)}
                </span>
              </p>
            </div>
          </div>
          <Link
            href="/login"
            className="btn btn-primary btn-block mt-8 uppercase">
            please log in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Cart;
