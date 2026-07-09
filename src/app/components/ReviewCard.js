import React from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchReview } from "../services/axios";
import LoadingSpinerMini from "./LoadingSpinerMini";
import { Swiper, SwiperSlide } from "swiper/react";
import { TiStarFullOutline } from "react-icons/ti";

export default function ReviewCard() {
  const { _id } = useParams();

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["Review", _id],
    queryFn: () => fetchReview(_id),
    enabled: !!_id,
  });

  console.log(reviews);

  if (isLoading) return <LoadingSpinerMini />;

  if (reviews?.length < 1) {
    return (
      <div className="p-8 border border-primary/20 rounded-md mt-10">
        <h1 className="text-lg font-bold text-primary">No active feedback</h1>
        <p className="text-primary/70 mt-1">
          Purchase history is required to contribute to the product review
          stream.
        </p>
      </div>
    );
  }

  return (
    <Swiper slidesPerView={3} spaceBetween={12} className="mt-10">
      {reviews.map((r) => {
        const { _id, username, rating, comment, createdAt } = r;

        const month = new Date(createdAt).toLocaleDateString("en-US", {
          month: "long",
        });

        const day = new Date(createdAt).getDate();

        return (
          <SwiperSlide
            className="bg-card border border-primary/20 rounded-xl p-5"
            key={_id}>
            <div className="flex justify-between">
              <div>
                <p className="text-[14px]">{username}</p>
                <p className="text-gray-400 text-sm">
                  {day}
                  <span> {month}</span>
                </p>
              </div>
              <div className="flex">
                {Array.from({ length: rating }).map((_, index) => (
                  <TiStarFullOutline key={index} fill="orange" />
                ))}
              </div>
            </div>
            <h1 className="mt-5">{comment}</h1>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}
