"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

const Filters = ({
  categories,
  companies,
  initialFilters,
  fetchProducts,
  onReset,
}) => {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: initialFilters,
  });

  const onSubmit = (data) => {
    fetchProducts(data);
  };

  const handleReset = () => {
    reset(initialFilters);
    onReset();
  };

  const [price, setPrice] = useState(100000);

  const dollarsAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price / 100);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="border border-primary/20 rounded-lg px-8 py-4 grid gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-center shadow-lg">
      {/* 1. ПОИСК */}
      <div className="">
        <label className="p-1 font-semibold capitalize">search product</label>
        <input
          {...register("search")}
          type="search"
          className="input input-sm rounded-lg bg-base-300"
          placeholder="Search by name or style"
        />
      </div>

      {/* 2. КАТЕГОРИИ */}
      <div className="form-control">
        <label className="p-1 font-semibold capitalize">select category</label>
        <select
          {...register("category")}
          className="select select-sm rounded-lg bg-base-300">
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* 3. КОМПАНИИ */}
      <div className="form-control">
        <label className="p-1 font-semibold capitalize">select company</label>
        <select
          {...register("company")}
          className="select rounded-lg select-sm bg-base-300">
          {companies.map((com) => (
            <option key={com}>{com}</option>
          ))}
        </select>
      </div>

      {/* 4. СОРТИРОВКА */}
      <div className="form-control">
        <label className="p-1 font-semibold capitalize">sort by</label>
        <select
          {...register("order")}
          className="select select-sm rounded-lg bg-base-300">
          <option value="a-z">a-z</option>
          <option value="z-a">z-a</option>
          <option value="high">high</option>
          <option value="low">low</option>
        </select>
      </div>

      {/* 5. ЦЕНА */}
      <div className="lg:col-span-2">
        <div className="flex justify-between items-center">
          <label className="p-1 font-semibold capitalize">select price</label>
          <p>{dollarsAmount}</p>
        </div>
        <input
          {...register("price")}
          type="range"
          min={0}
          max={100000}
          step={10}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full h-3 appearance-none rounded-lg cursor-pointer bg-base-300 
             accent-primary
             [&::-webkit-slider-thumb]:appearance-none 
             [&::-webkit-slider-thumb]:h-3 
             [&::-webkit-slider-thumb]:w-6 
             [&::-webkit-slider-thumb]:bg-primary 
             [&::-webkit-slider-thumb]:rounded-md"
        />
      </div>

      {/* 6. ДОСТАВКА */}
      <div className=" flex gap-2 items-center justify-between bg-base-300 p-2 rounded-lg">
        <label className="font-semibold capitalize">free shipping</label>
        <input
          {...register("shipping")}
          type="checkbox"
          className="checkbox bg-primary checkbox-primary checkbox-sm rounded-lg"
        />
      </div>

      {/* КНОПКИ */}
      <div className="grid grid-cols-2 gap-2 items-end w-full lg:col-span-1 md:col-span-3 sm:col-span-2">
        <button
          type="submit"
          className="btn btn-primary btn-sm border-none rounded-lg">
          <p className="uppercase text-sm font-semibold">search</p>
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="btn-sm border-none rounded-lg bg-primary-content! btn">
          <p className="uppercase text-sm font-semibold text-primary">reset</p>
        </button>
      </div>
    </form>
  );
};

export default Filters;
