"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { fetchSingleProduct } from "../../services/axios";
import LoadingSpiner from "../../components/LoadingSpiner";
import { storeCart, storeFavorite } from "../../services/storeCart";
import ShareButton from "../../components/ShareBtn";
import { Swiper, SwiperSlide } from "swiper/react";
import { BsTruck } from "react-icons/bs";
import { FaShieldHalved } from "react-icons/fa6";
import { TbReceiptRefund } from "react-icons/tb";

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
  const [avaible, setAvaible] = useState(true);

  const favoriteItems = storeFavorite((state) => state.favoriteItems);

  useEffect(() => {
    if (data?.colors?.length > 0) {
      setColor(data.colors[0]);
    }
  }, [data]);

  const isLiked = data
    ? favoriteItems.some((item) => {
        const itemId = item.id || item._id;
        return String(itemId) === String(data._id);
      })
    : false;

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

  const handleFav = () => {
    const { toggleFav } = storeFavorite.getState();
    const favProduct = {
      id: data._id,
      image: data.image,
      title: data.title,
      price: data.price,
      company: data.company,
      amount: amount,
    };
    toggleFav(favProduct);

    if (!isLiked) {
      toast.success("Added to Wishlist", { autoClose: 1500 });
    } else {
      toast.info("Removed from Wishlist", { autoClose: 1500 });
    }
  };

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

  const {
    title,
    price,
    image,
    company,
    description,
    colors,
    stock,
    images,
    averageRating,
  } = data;

  if (stock === 0 || stock < 1) setAvaible(false);

  return (
    <section className="py-12 px-8 mx-auto max-w-7xl">
      <div className="text-sm breadcrumbs mb-2 text-base-content font-medium">
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
          <li className="font-semibold">{title}</li>
        </ul>
      </div>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.3em] text-[#b45309] font-bold">
            Product Detail
          </p>
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-primary tracking-tight mt-3">
            {title}
          </h1>
          <p className="text-base md:text-lg text-primary/60 leading-relaxed mt-3">
            A premium detail experience with warm editorial photography, elegant
            material swatches, and a refined buying journey for modern living
            spaces.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ShareButton />
          <button
            className="min-h-11 px-5 py-3 rounded-xl bg-primary text-primary-foreground shadow-md font-semibold text-primary-content cursor-pointer"
            onClick={handleFav}>
            {isLiked ? "Remove from  Wishlist" : "Add to Wishlist"}
          </button>
        </div>
      </div>

      <div className="mb-10 mt-8 h-px w-full bg-primary/20"></div>

      <div className="grid gap-y-12 lg:grid-cols-2 lg:gap-x-16 items-start">
        <figure className="relative overflow-hidden rounded-2xl shadow-md">
          <img
            src={image}
            alt={title}
            className="w-full h-100 lg:h-125 object-cover"
          />
          <Swiper slidesPerView={3} spaceBetween={12}>
            {images &&
              images.map((i, img) => {
                <SwiperSlide key={i}>
                  <Image src={img} alt={title} />
                </SwiperSlide>;
              })}
          </Swiper>
        </figure>

        <div className="bg-card border border-primary/20 rounded-4xl shadow-md p-8 md:p-10 flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <span className="inline-flex items-center gap-2 bg-secondary px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide border border-primary/20 w-fit uppercase">
              <span className="w-2.5 h-2.5 rounded-full bg-[#b45309]"></span>
              {company}
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              {title}
            </h1>
            <p className="text-3xl font-heading font-bold ">
              {formatPrice(price)}
            </p>
            <p className="text-base text-primary/50 leading-relaxed">
              {description}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-secondary rounded-2xl border border-primary/20 p-4">
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                Material
              </p>
              <p className="font-semibold text-foreground mt-2">
                Walnut & Steel
              </p>
            </div>
            <div className="bg-secondary rounded-2xl border border-primary/20 p-4">
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                Delivery
              </p>
              <p className="font-semibold text-foreground mt-2">2–4 Days</p>
            </div>
            <div className="bg-secondary rounded-2xl border border-primary/20 p-4">
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                Rating
              </p>
              <p className="font-semibold text-foreground mt-2">
                {averageRating}
              </p>
            </div>
          </div>

          {colors && colors.length > 0 && (
            <div>
              <h4 className="text-sm font-bold tracking-wider capitalize mb-3 text-neutral-content">
                Colors
              </h4>
              <div className="flex items-center gap-3">
                {colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`rounded-full w-8 h-8 cursor-pointer border-2  transition-all ${
                      c === color
                        ? "border-primary scale-110 "
                        : "border-transparent"
                    }`}
                    style={{ backgroundColor: c }}
                    onClick={() => setColor(c)}
                  />
                ))}
              </div>
            </div>
          )}

          {avaible ? (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold tracking-wider capitalize text-neutral-content">
                  Amount
                </h4>
                <p className="text-sm text-neutral-content/50">
                  {stock} in stock
                </p>
              </div>
              <select
                id="amount"
                className="select select-primary w-full max-w-xs border-primary/20 bg-secondary rounded-lg"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}>
                {Array.from({ length: stock }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
              <div className="mt-4">
                <button
                  className="w-full md:w-auto px-8 py-3 bg-primary text-primary-content rounded-lg font-bold uppercase tracking-wide shadow-md hover:bg-primary/85 transition-all active:scale-95 cursor-pointer"
                  onClick={handleAddToCart}>
                  Add to Bag
                </button>
              </div>
            </div>
          ) : (
            <h1 className="text-lg font-bold tracking-wider capitalize mb-3 text-neutral-content">
              Out of stock
            </h1>
          )}
          <div className="border-t border-primary/20 pt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-secondary flex items-center justify-center border border-border">
                <BsTruck />
              </div>
              <div>
                <p className="text-sm font-semibold">Fast Shipping</p>
                <p className="text-sm">Free worldwide delivery available.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-secondary flex items-center justify-center border border-border">
                <FaShieldHalved />
              </div>
              <div>
                <p className="text-sm font-semibold">Secure Checkout</p>
                <p className="text-sm">Protected payment experience.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-secondary flex items-center justify-center border border-border">
                <TbReceiptRefund />
              </div>
              <div>
                <p className="text-sm font-semibold">Easy Returns</p>
                <p className="text-sm">Hassle-free returns within 30 days.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductsDetail;
