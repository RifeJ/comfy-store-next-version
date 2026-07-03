"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchFilterProducts } from "../services/axios";
import LoadingSpiner from "../components/LoadingSpiner";
import Filters from "../components/Filters";
import ProductCard from "../components/ProductCard";
import { IoMdStar } from "react-icons/io";
import ServerErrorBlock from "../components/ServerErrorBlock";

const initialFilters = {
  search: "",
  category: "all",
  company: "all",
  order: "a-z",
  price: 100000,
  shipping: "",
};

function Products() {
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);

  const { data, isLoading, error } = useQuery({
    queryKey: ["FilterProducts", appliedFilters],
    queryFn: () => fetchFilterProducts(appliedFilters),
  });

  if (isLoading) return <LoadingSpiner />;
  if (error) return <ServerErrorBlock />;

  const products = data?.data;
  const meta = data?.meta;
  console.log(data);

  const fetchProducts = (dataFromForm) => {
    const formattedFilters = {
      ...dataFromForm,
      shipping: dataFromForm.shipping ? "on" : "",
    };
    setAppliedFilters(formattedFilters);
  };

  return (
    <section className="py-20 px-8 mx-auto max-w-7xl">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 border-b border-base-300 pb-8 mb-8">
        <div className="flex flex-col gap-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-secondary px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide w-fit shadow-sm">
            <div className="w-2 h-2 rounded-full bg-[#b45309]"></div>
            <p>Curated Product Directory</p>
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold tracking-tight leading-tight">
            Discover furniture designed for calm, warm and modern living.
          </h1>
          <p className="text-base md:text-lg leading-relaxed">
            Browse our premium catalog of chairs, tables, sofas and interior
            accents with refined filtering, elevated presentation, and a serene
            shopping experience.
          </p>
        </div>
        <div className=" grid grid-cols-3 gap-4 md:gap-6">
          <div className="bg-card border border-base-300 rounded-2xl shadow-sm px-5 py-4 min-w-32.5">
            <h1 className=" block text-2xl font-heading font-bold text-foreground">
              21
            </h1>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              Products
            </p>
          </div>
          <div className="bg-card border border-base-300 rounded-2xl shadow-sm px-5 py-4 min-w-32.5">
            <h1 className=" block text-2xl font-heading font-bold text-foreground">
              5
            </h1>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              Collections
            </p>
          </div>
          <div className="bg-card border border-base-300 rounded-2xl shadow-sm px-5 py-4 min-w-32.5">
            <h1 className="flex items-center text-2xl font-heading font-bold text-foreground">
              4.9
              <IoMdStar />
            </h1>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              Top rated
            </p>
          </div>
        </div>
      </div>
      <Filters
        initialFilters={initialFilters}
        categories={meta?.categories || []}
        companies={meta?.companies || []}
        fetchProducts={fetchProducts}
        onReset={() => setAppliedFilters(initialFilters)}
      />

      <div className="pt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products && products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <h2 className="text-2xl mt-16">No products matched your search...</h2>
        )}
      </div>
    </section>
  );
}

export default Products;
