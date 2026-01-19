"use client";

import SectionTitle from "@/utilits/SectionTitle";
import { Pagination, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import React from "react";
import { IChoose } from "@/types";
import ChooseCard from "../card/ChooseCard";

interface Props {
  chooses: IChoose[];
}
const ChooseSection: React.FC<Props> = ({ chooses }) => {
  return (
    <div className="max-w-6xl w-full mx-auto pt-6 ">
      <div>
        <SectionTitle
          title="Why Choose Us"
          subTitle="From individual stays to family getaways, our properties cater to all your accommodation needs."
        />
      </div>
      <div>
        <div className="mt-8">
          {chooses?.length > 0 ? (
            <>
              <div className="relative">
                {/* Previous Button */}
                <button className="custom-prev3 absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed hidden sm:flex">
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Next Button */}
                <button className="custom-next3 absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed hidden sm:flex">
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <Swiper
                  modules={[Pagination, Navigation]}
                  spaceBetween={8}
                  slidesPerView={1}
                  loop={true}
                  pagination={{ el: ".custom-pagination3", clickable: true }}
                  navigation={{
                    nextEl: ".custom-next3",
                    prevEl: ".custom-prev3",
                  }}
                  breakpoints={{
                    640: { slidesPerView: 2 },
                    768: { slidesPerView: 3 },
                    1024: { slidesPerView: 3 },
                    1280: { slidesPerView: 3 },
                    1536: { slidesPerView: 4 },
                  }}
                >
                  {chooses.map((choose) => (
                    <SwiperSlide key={choose._id} className="py-2 px-1 hover:text-white">
                      <ChooseCard choose={choose} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
              <div className="custom-pagination3  flex justify-center gap-2 mt-4"></div>
            </>
          ) : (
            <p className="text-center text-gray-500 mt-4">
              No information available at the moment.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChooseSection;
