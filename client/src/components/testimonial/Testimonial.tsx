"use client";
import { useEffect, useState } from "react";
import TestimonialApi from "@/app/apis/testimonials.apis";
import { ITestimonial } from "@/types/testimonials";
import { Pagination, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import SectionTitle from "@/utilits/SectionTitle";

// Utility function to convert YouTube/watch links -> embed
const getYoutubeEmbedUrl = (url: string) => {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname.includes("youtube.com")) {
      const videoId = urlObj.searchParams.get("v");
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }
    if (urlObj.hostname.includes("youtu.be")) {
      const videoId = urlObj.pathname.slice(1);
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }
    return null;
  } catch {
    return null;
  }
};

const HomeTestimonials = () => {
  const [testimonials, setTestimonials] = useState<ITestimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await TestimonialApi.getTestimonials();
        setTestimonials(res.data.filter((t) => t.videoUrl));
      } catch (err) {
        console.error("Error fetching testimonials:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  if (loading) return <p className="text-center">Loading testimonials...</p>;

  return (
    <div className="max-w-6xl mx-auto pt-8">
     <div>
        <SectionTitle
          title="What people say about us"
          subTitle="Hear from our satisfied customers about their experiences."
        />
      </div>
      
      {testimonials?.length > 0 ? (
        <div className="relative">
          {/* Previous Button */}
          <button className="custom-prev-testimonial absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed hidden sm:flex">
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Next Button */}
          <button className="custom-next-testimonial absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed hidden sm:flex">
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <Swiper
            modules={[Pagination, Navigation]}
            spaceBetween={24}
            slidesPerView={1}
            loop={true}
            pagination={{ el: ".custom-pagination-testimonial", clickable: true }}
            navigation={{
              nextEl: ".custom-next-testimonial",
              prevEl: ".custom-prev-testimonial",
            }}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
          >
            {testimonials.map((t) => {
              const embedUrl = t.videoUrl ? getYoutubeEmbedUrl(t.videoUrl) : null;
              if (!embedUrl) return null;

              return (
                <SwiperSlide key={t.name} className="py-2">
                  <div className="min-w-[220px] bg-white rounded-xl shadow p-3">
                    <iframe
                      className="w-full h-50 rounded-lg "
                      src={embedUrl}
                      title={t.name}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                    <p className="mt-2 text-sm text-gray-700 font-semibold">
                      {t.name}
                    </p>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>

          <div className="custom-pagination-testimonial flex justify-center gap-2 mt-4"></div>
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-4">
          No testimonials available at the moment.
        </p>
      )}
    </div>
  );
};

export default HomeTestimonials;