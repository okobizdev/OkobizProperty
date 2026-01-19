"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import React, { useRef } from "react";
import { TBanner } from "@/types";

import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { apiBaseUrl } from "@/config/config";
import { Swiper as SwiperClass } from "swiper";
import Image from "next/image";

interface BannerProps {
  banners: TBanner[];
}

const BannerSlider: React.FC<BannerProps> = ({ banners }) => {
  const swiperRef = useRef<SwiperClass | null>(null);

  return (
    <div className="w-full">
      <Swiper
        spaceBetween={0}
        slidesPerView={1}
        modules={[Navigation, Autoplay]}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        onSwiper={(swiper) => (swiperRef.current = swiper as SwiperClass)}
        speed={1200}
        loop={banners.length > 1}
      >
        {banners.length > 0 ? (
          banners.map((banner: TBanner) => (
            <SwiperSlide key={banner._id}>
              <div className="w-full relative h-[250px] sm:h-[350px] md:h-screen lg:screen ">
                <Image
                  src={apiBaseUrl + banner.bannerImage || ""}
                  alt="Banner"
                  fill
                  className="object-fit"
                  priority
                  sizes="100vw"
                />
              </div>
            </SwiperSlide>
          ))
        ) : (
          <div className="w-full h-[250px] sm:h-[350px] md:h-[450px] lg:h-[550px] xl:h-[600px] 2xl:h-[650px] flex items-center justify-center bg-gray-100">
            <p className="text-gray-500 text-lg">No banners available</p>
          </div>
        )}
      </Swiper>
    </div>
  );
};

export default BannerSlider;