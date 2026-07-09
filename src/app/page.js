"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchFeaturedProducts } from "./services/axios";
import Link from "next/link";
import LoadingSpiner from "./components/LoadingSpiner";
import ServerErrorBlock from "./components/ServerErrorBlock";
import { FaArrowRightLong } from "react-icons/fa6";
import { FaRegStar, FaPlus } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import Image from "next/image";

function MainPage() {
  const {
    data: products = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["FeaturedProducts"],
    queryFn: fetchFeaturedProducts,
  });

  const handleAdd = (id) => {
    toggleFav(id);
  };

  if (isLoading) return <LoadingSpiner />;
  if (error) return <ServerErrorBlock />;

  return (
    <section className="py-20 max-xl:py-10 px-8 mx-auto max-w-7xl w-full">
      <div className="grid grid-cols-2 items-center max-lg:gap-5 max-lg:grid-cols-1">
        <div>
          <h1 className="text-5xl/[64px] font-bold tracking-tight">
            We are changing
          </h1>
          <h1 className="text-5xl/[64px] font-bold tracking-tight">
            the way people shop
          </h1>
          <p className="mt-6 w-full max-w-125 text-lg leading-8 max-lg:max-w-220">
            Design your dream space with our premium selection of furniture.
            From elegant sofas to handcrafted tables, we offer quality pieces
            that combine style, durability, and unmatched comfort.
          </p>
          <Link href={"Products"}>
            <button className="bg-primary rounded-xl cursor-pointer py-4 px-8 mt-10! home-button mr-5">
              <p className="flex justify-center items-center gap-2 uppercase text-primary-content font-semibold">
                our products <FaArrowRightLong />
              </p>
            </button>
          </Link>
          <button className="bg-base-300 rounded-xl cursor-pointer py-4 px-8 mt-10! hover:brightness-150 duration-500">
            <p className="text-primary font-semibold">Explore Spaces</p>
          </button>
          <div className="h-px w-[90%] bg-primary/10 my-6"></div>
          <div className="flex items-center gap-11">
            <div>
              <h1 className="text-2xl font-bold mb-1">12k+</h1>
              <p className="text-[12px] brightness-65">Spaces Transformed</p>
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-1">4.9★</h1>
              <p className="text-[12px] brightness-65">Customer Rating</p>
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-1">10 Yr</h1>
              <p className="text-[12px] brightness-65">Quality Warranty</p>
            </div>
          </div>
        </div>
        <div className="flex gap-5 max-md:flex-col">
          <Link
            href={"/"}
            className="home-photo-1 max-w-115 h-105 rounded-2xl p-5 flex flex-col justify-end items-start max-xl:max-w-165 max-xl:max-h-120 w-full">
            <p className="text-orange-300 uppercase font-bold">
              featured concept
            </p>
            <p className="text-white text-lg font-bold">
              The Nodric Serenity Suite
            </p>
            <p className="text-white/80 text-[13px]">
              Featuring our signature bouclé curved sofa & organic oak table
            </p>
          </Link>
          <div className="flex flex-col gap-5 max-xl:hidden max-lg:flex max-md:flex-row">
            <Link
              href={"/"}
              className="home-photo-2 h-50 w-60 max-lg:w-80 rounded-2xl p-5 flex flex-col justify-end items-start max-lg:h-57">
              <p className="text-white uppercase text-[12px] font-semibold">
                Dining Collection
              </p>
            </Link>
            <Link
              href={"/"}
              className="home-photo-3 h-50 w-60 max-lg:w-80 rounded-2xl p-5 flex flex-col justify-end items-start max-lg:h-57">
              <p className="text-white uppercase text-[12px] font-semibold">
                Lounge Accent
              </p>
            </Link>
          </div>
        </div>
      </div>
      <div className="pt-24!">
        <div className="border-b border-base-300 pb-5 mb-12">
          <p className="text-yellow-400 text-sm font-bold uppercase">
            Our Curated Selection
          </p>
          <h1 className="text-3xl font-bold tracking-wider capitalize">
            featured products
          </h1>
        </div>
        <Swiper
          observer={true}
          observeParents={true}
          modules={[Autoplay]}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop={true}
          slidesPerView={1}
          spaceBetween={0}
          breakpoints={{
            673: {
              slidesPerView: 2,
              spaceBetween: 24,
            },
            1280: {
              slidesPerView: 3,
              spaceBetween: 32,
            },
          }}>
          {products.map((p) => {
            const { _id, title, category, description, price, image, reviews } =
              p;

            const dollarsAmount = new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(price / 100);

            return (
              <SwiperSlide
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
                <Link
                  href={`products/${_id}`}
                  className="p-6 flex flex-col gap-3">
                  <div className="flex justify-between items-start gap-4 max-[792px]:flex-col-reverse">
                    <div>
                      <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                        {category}
                      </p>
                      <p className="font-bold  text-lg group-hover:text-amber-400 transition-colors">
                        {title}
                      </p>
                    </div>
                    <p className="font-heading font-extrabold text-lg">
                      {dollarsAmount}
                    </p>
                  </div>
                  <p className="text-xs line-clamp-2">
                    <span className="">{description}</span>
                  </p>
                  <div className="flex items-center justify-between pt-3 mt-2">
                    <div className="flex items-center justify-center gap-1 text-amber-400">
                      {Array(5)
                        .fill(null)
                        .map((_, index) => (
                          <FaRegStar key={index} />
                        ))}
                      <p className="text-xs text-primary ml-1 font-medium">
                        ({reviews} reviews)
                      </p>
                    </div>
                    <button className="w-10 h-10 bg-base-300 rounded-xl flex items-center justify-center transition-all max-[600px]:hidden">
                      <FaPlus />
                    </button>
                  </div>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
}

export default MainPage;
