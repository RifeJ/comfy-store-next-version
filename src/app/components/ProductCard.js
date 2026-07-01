import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaRegStar, FaPlus } from "react-icons/fa";

const ProductCard = ({ product }) => {
  const { _id, title, category, description, price, image } = product;

  const dollarsAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price / 100);

  return (
    <div
      key={_id}
      className="bg-card group rounded-2xl hover:-translate-y-1 transition-all duration-500">
      <figure className="relative overflow-hidden h-64">
        <Image
          src={image}
          alt={image}
          height={256}
          width={400}
          className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105 rounded-t-2xl"
        />
      </figure>
      <Link href={`products/${_id}`} className="p-6 flex flex-col gap-3">
        <div className="flex justify-between items-start gap-4">
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
              {category}
            </p>
            <p className="font-bold text-[16px] group-hover:text-amber-400 transition-colors">
              {title}
            </p>
          </div>
          <p className="font-heading font-extrabold text-lg">{dollarsAmount}</p>
        </div>
        <p className="text-xs line-clamp-2">{description}</p>
        <div className="flex items-center justify-between pt-3 mt-1 border-t">
          <div className="flex items-center justify-center gap-1 text-amber-400">
            {Array(5)
              .fill(null)
              .map((_, index) => (
                <FaRegStar key={index} />
              ))}
            <p className="text-xs text-primary ml-1 font-medium">
              ({/*reviews_count*/} reviews)
            </p>
          </div>
          <button className="w-10 h-10 bg-base-300 rounded-xl flex items-center justify-center transition-all cursor-pointer">
            <FaPlus />
          </button>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
