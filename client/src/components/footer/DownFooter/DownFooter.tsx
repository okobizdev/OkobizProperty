"use client";
import React, { useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { RxHome } from "react-icons/rx";

import Link from "next/link";
import { RiBuilding2Line } from "react-icons/ri";


const DownFooter = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Check if the user has scrolled past 100px
      if (window.scrollY > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      // Check if the user has reached the bottom of the page
      const isBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight;

      if (isBottom) {
        setIsVisible(false); // Hide the footer when at the bottom of the page
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (

    <div
      className={`fixed  bottom-0 md:py-12 py-4 w-full bg-[#fff] shadow-2xl border-t border-[#1D4095] z-[999]  transition-transform duration-300 left-0 ${isVisible ? "translate-y-0 " : "translate-y-full"
        } md:hidden`}
    >
      <div className="px-12 flex items-center justify-between">


        <Link href="/">
          <div className="flex flex-col items-center justify-between capitalize text-[#262626]/80 hover:text-primary duration-300">
            <p>
              <IoSearchOutline className="text-xl" />
            </p>
            <p className="text-[12px]">Explore</p>
          </div>
        </Link>

        <Link href="properties?listingType=rent">
          <div className="flex flex-col items-center justify-between capitalize text-[#262626]/80 hover:text-primary duration-300">
            <p>
              <RxHome className="text-xl" />
            </p>
            <p className="text-[12px]">Rent</p>
          </div>
        </Link>

        <Link href="properties?listingType=sell">
          <div className="flex flex-col items-center justify-between capitalize text-[#262626]/80 hover:text-primary duration-300">
            <p>
              <RiBuilding2Line className="text-xl" />
            </p>
            <p className="text-[12px]">Buy/Sell</p>
          </div>
        </Link>


      </div>
    </div>
  );
};

export default DownFooter;
