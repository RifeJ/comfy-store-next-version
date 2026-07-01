"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { fetchSingleProduct } from "../../services/axios";
import LoadingSpiner from "../../components/LoadingSpiner";
import storeCart from "../../services/storeCart";

const formatPrice = (price) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price / 100);
};

function ProductsDetail() {
  const { _id } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["SingleProduct", _id],
    queryFn: () => fetchSingleProduct(_id),
    enabled: !!_id,
  });

  const [amount, setAmount] = useState(1);
  const [color, setColor] = useState("");

  useEffect(() => {
    if (data?.colors?.length > 0) {
      setColor(data.colors[0]);
    }
  }, [data]);

  const handleAddToCart = () => {
    if (!data) return;

    const { addToCart } = storeCart.getState();

    const selectedColor = color || (data.colors ? data.colors[0] : "");

    const cartProduct = {
      cartID: `${data._id}${selectedColor}`,
      productID: data._id,
      image: data.image,
      title: data.title,
      price: data.price,
      company: data.company,
      amount: amount,
      color: selectedColor,
    };

    addToCart(cartProduct);
    toast.success("Item added to cart", { autoClose: 2000, draggable: true });

    fetch("");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <LoadingSpiner />
      </div>
    );
  }

  if (!data || isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] px-8 text-center">
        <h2 className="text-3xl font-bold text-gray-700">Product not found</h2>
        <Link
          href="/products"
          className="mt-6 px-6 py-2 bg-[#463aa1] text-white rounded-lg">
          Back to Products
        </Link>
      </div>
    );
  }

  const { title, price, image, company, description, colors } = data;

  return (
    <section className="py-16 px-8 mx-auto max-w-6xl">
      <div className="text-sm breadcrumbs mb-8 text-base-content font-medium">
        <ul className="flex items-center space-x-2">
          <li>
            <Link href="/" className="">
              Home
            </Link>
          </li>
          <li>
            <Link href="/products" className="">
              Products
            </Link>
          </li>
        </ul>
      </div>

      <div className="grid gap-y-12 lg:grid-cols-2 lg:gap-x-16 items-start">
        <figure className="relative overflow-hidden rounded-2xl shadow-md">
          <img
            src={image}
            alt={title}
            className="w-full h-[400px] lg:h-[500px] object-cover"
          />
        </figure>

        <div className="flex flex-col gap-6">
          <div>
            <h1 className="capitalize text-4xl font-extrabold text-primary">
              {title}
            </h1>
            <h4 className="text-xl text-neutral-content font-bold mt-2 uppercase tracking-wide">
              {company}
            </h4>
            <p className="mt-4 text-2xl font-bold text-primary">
              {formatPrice(price)}
            </p>
          </div>

          <p className="text-base leading-relaxed text-base-content">
            {description}
          </p>

          {colors && colors.length > 0 && (
            <div>
              <h4 className="text-sm font-bold tracking-wider capitalize mb-3 text-neutral-content">
                Colors
              </h4>
              <div className="flex items-center gap-5">
                {colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`rounded-full w-8 h-8 cursor-pointer border-2 transition-all ${
                      c === color
                        ? "border-black scale-110 "
                        : "border-transparent"
                    }`}
                    style={{ backgroundColor: c }}
                    onClick={() => setColor(c)}
                  />
                ))}
              </div>
            </div>
          )}

          <div>
            <h4 className="text-sm font-bold tracking-wider capitalize mb-3 text-neutral-content">
              Amount
            </h4>
            <select
              id="amount"
              className="select select-bordered w-full max-w-xs border-primary  rounded-lg"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}>
              {Array.from({ length: 20 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4">
            <button
              className="w-full md:w-auto px-8 py-3 bg-primary text-[#dbd4ed] rounded-lg font-bold uppercase tracking-wide shadow-md hover:bg-primary/85 transition-all active:scale-95 cursor-pointer"
              onClick={handleAddToCart}>
              Add to Bag
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductsDetail;
