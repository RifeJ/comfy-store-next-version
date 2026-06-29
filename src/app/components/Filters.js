

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

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-base-200 rounded-md px-8 py-4 grid gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-center">
      {/* 1. ПОИСК */}
      <div className="form-control">
        <label className="label-text capitalize">search product</label>
        <input
          {...register("search")}
          type="search"
          className="input input-bordered input-sm"
        />
      </div>

      {/* 2. КАТЕГОРИИ */}
      <div className="form-control">
        <label className="label-text capitalize">select category</label>
        <select
          {...register("category")}
          className="select select-bordered select-sm">
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* 3. КОМПАНИИ */}
      <div className="form-control">
        <label className="label-text capitalize">select company</label>
        <select
          {...register("company")}
          className="select select-bordered select-sm">
          {companies.map((com) => (
            <option key={com}>{com}</option>
          ))}
        </select>
      </div>

      {/* 4. СОРТИРОВКА */}
      <div className="form-control">
        <label className="label-text capitalize">sort by</label>
        <select
          {...register("order")}
          className="select select-bordered select-sm">
          <option value="a-z">a-z</option>
          <option value="z-a">z-a</option>
          <option value="high">high</option>
          <option value="low">low</option>
        </select>
      </div>

      {/* 5. ЦЕНА */}
      <div className="form-control">
        <label className="label-text capitalize">select price</label>
        <input
          {...register("price")}
          type="range"
          min={0}
          max={100000}
          step={1000}
          className="range range-primary range-sm"
        />
      </div>

      {/* 6. ДОСТАВКА */}
      <div className="form-control flex flex-col gap-2 items-center justify-between">
        <label className="label-text capitalize cursor-pointer">
          free shipping
        </label>
        <input
          {...register("shipping")}
          type="checkbox"
          className="checkbox checkbox-primary checkbox-sm ml-3"
        />
      </div>

      {/* КНОПКИ */}
      <button type="submit" className="btn btn-primary btn-sm">
        <p className="uppercase text-[14px] font-semibold">search</p>
      </button>
      <button
        type="button"
        onClick={handleReset}
        className="btn btn-accent btn-sm">
        <p className="uppercase text-[14px] font-semibold">reset</p>
      </button>
    </form>
  );
};

export default Filters;
