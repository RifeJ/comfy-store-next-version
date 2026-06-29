"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchFilterProducts } from "../services/axios";
import LoadingSpiner from "../components/LoadingSpiner";
import Filters from "../components/Filters";
import ProductCard from "../components/ProductCard";

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
  if (error) return <ServiceWorkerRegistration />;

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
    <section className="py-20 px-8 mx-auto max-w-6xl">
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
