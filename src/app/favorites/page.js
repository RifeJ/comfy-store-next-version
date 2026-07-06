"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FaTrashAlt } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { toast } from "react-toastify";
import { storeFavorite, storeCart } from "../services/storeCart";

export default function FavoritesPage() {
  const [isMounted, setIsMounted] = useState(false);

  const favoriteItems = storeFavorite((state) => state.favoriteItems) || [];
  const { removeFromFav } = storeFavorite.getState();
  const { clearFavorites } = storeFavorite.getState();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleAddToCart = (item) => {
    const { addToCart } = storeCart.getState();

    const selectedColor =
      item.color ||
      (item.colors && item.colors.length > 0 ? item.colors[0] : "");

    const cartProduct = {
      cartID: `${item.id}${selectedColor}`,
      productID: item.id,
      image: item.image,
      title: item.title,
      price: item.price,
      company: item.company,
      amount: 1,
      color: selectedColor,
    };

    addToCart(cartProduct);
    toast.success("Item added to cart", { autoClose: 2000, draggable: true });
  };

  if (!isMounted) return null;

  if (favoriteItems.length === 0) {
    return (
      <div className="mx-auto w-full max-w-7xl px-8 py-20 text-center">
        <h1 className="text-3xl font-medium tracking-wider mb-4 text-white">
          Your Wishlist is Empty
        </h1>
        <p className="text-slate-400 mb-8">
          You haven't added any products to your favorites yet.
        </p>
        <Link
          href="/products"
          className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-3 rounded-xl transition-colors">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-8 py-12 ">
      <div className="border-b border-primary/20 pb-5 mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-wider text-primary">
          Favorites{" "}
          <span className="text-sm text-slate-400 ml-2">
            ({favoriteItems.length} items)
          </span>
        </h1>
        <button
          className="text-xl font-bold tracking-wider text-primary cursor-pointer"
          onClick={() => clearFavorites()}>
          Clear all
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {favoriteItems.map((item) => (
          <div
            key={item.id}
            className="bg-card rounded-2xl p-4 flex flex-col gap-4 shadow-lg border border-primary/20 hover:border-primary/30 transition-all group">
            <Link
              href={`/products/${item.id}`}
              className="block relative h-48 w-full overflow-hidden rounded-xl">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-350"
              />
            </Link>

            <div className="flex flex-col gap-1 grow">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">
                {item.company}
              </span>

              <div className="flex justify-between items-start gap-2">
                <Link
                  href={`/products/${item.id}`}
                  className="text-md font-bold text-primary hover:text-blue-400 transition-colors line-clamp-1">
                  {item.title}
                </Link>
                <span className="text-md font-semibold text-emerald-400 shrink-0">
                  ${item.price / 100}
                </span>
              </div>
            </div>

            <div className="flex gap-2 mt-auto pt-3 border-t border-slate-800">
              <button
                onClick={() => handleAddToCart(item)}
                className="grow flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 px-4 rounded-xl transition-colors text-sm">
                <FiShoppingCart size={16} />
                Add to Cart
              </button>

              <button
                onClick={() => {
                  removeFromFav(item.id);
                  toast.error("Removed from favorites");
                }}
                className="p-2.5 bg-slate-800 hover:bg-rose-950/30 text-slate-400 hover:text-rose-400 border border-slate-700 hover:border-rose-900/50 rounded-xl transition-all"
                aria-label="Remove from favorites">
                <FaTrashAlt size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
