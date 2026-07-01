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
      className="bg-base-300 rounded-lg px-8 py-4 grid gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-center">
      {/* 1. ПОИСК */}
      <div className="">
        <label className="p-1 font-semibold capitalize">search product</label>
        <input
          {...register("search")}
          type="search"
          className="input input-sm rounded-lg"
          placeholder="Search by name or style"
        />
      </div>

      {/* 2. КАТЕГОРИИ */}
      <div className="form-control">
        <label className="p-1 font-semibold capitalize">select category</label>
        <select
          {...register("category")}
          className="select select-sm rounded-lg">
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
          className="select rounded-lg select-sm">
          {companies.map((com) => (
            <option key={com}>{com}</option>
          ))}
        </select>
      </div>

      {/* 4. СОРТИРОВКА */}
      <div className="form-control">
        <label className="p-1 font-semibold capitalize">sort by</label>
        <select {...register("order")} className="select select-sm rounded-lg">
          <option value="a-z">a-z</option>
          <option value="z-a">z-a</option>
          <option value="high">high</option>
          <option value="low">low</option>
        </select>
      </div>

      {/* 5. ЦЕНА */}
      <div className="">
        <div className="flex justify-between items-center">
          <label className="p-1 font-semibold capitalize">select price</label>
          <p>{}</p>
        </div>
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
      <div className=" flex gap-2 items-center justify-between bg-primary-content p-1">
        <label className="font-semibold capitalize">free shipping</label>
        <input
          {...register("shipping")}
          type="checkbox"
          className="checkbox checkbox-primary checkbox-sm"
        />
      </div>

      {/* КНОПКИ */}
      <button type="submit" className="btn btn-primary btn-sm border-none rounded-lg">
        <p className="uppercase text-[14px] font-semibold">search</p>
      </button>
      <button
        type="button"
        onClick={handleReset}
        className="btn btn-sm border-none rounded-lg">
        <p className="uppercase text-[14px] font-semibold text-primary">
          reset
        </p>
      </button>
    </form>
  );
};

export default Filters;
