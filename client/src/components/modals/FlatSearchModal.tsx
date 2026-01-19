"use client";

import React from "react";
import { HiXMark } from "react-icons/hi2";
import { motion, AnimatePresence } from "framer-motion";
import { VscLocation } from "react-icons/vsc";
import { GoSearch } from "react-icons/go";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { apiBaseUrl } from "@/config/config";
interface FlatSearchModalProps {
  onClose: () => void;
  location: string;
  setLocation: (val: string) => void;
  price: number | "";
  setPrice: (val: number | "") => void;
  categoryId: string;
  setCategoryId: (val: string) => void;
  categories: { _id: string; categoryName: string }[];
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

const backdropVariants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const modalVariants = {
  hidden: { opacity: 0, y: -50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 25 },
  },
  exit: { opacity: 0, y: -30 },
};

const FlatSearchModal: React.FC<FlatSearchModalProps> = ({
  onClose,
  location,
  setLocation,
  price,
  setPrice,
  categoryId,
  setCategoryId,
  categories,
  loading,
}) => {
  const router = useRouter();
  const [locationSuggestions, setLocationSuggestions] = useState<
    { _id: string; location: string }[]
  >([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const queryParams = new URLSearchParams();

    if (location) queryParams.append("location", location);
    if (categoryId) queryParams.append("category", categoryId);
    if (price) queryParams.append("maxPrice", price.toString());
    queryParams.append("minPrice", "0");

    router.push(`/flat?${queryParams.toString()}`);
    onClose();
  };
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocation(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.length > 1) {
      debounceRef.current = setTimeout(async () => {
        try {
          const res = await fetch(
            `${apiBaseUrl}/location/search/${encodeURIComponent(value)}`
          );
          const json = await res.json();
          setLocationSuggestions(json.data || []);
          setShowSuggestions(true);
        } catch {
          setLocationSuggestions([]);
          setShowSuggestions(false);
        }
      }, 300);
    } else {
      setLocationSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (loc: string) => {
    setLocation(loc);
    setShowSuggestions(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed top-0 right-0 w-full h-full bg-[#262626]/20 z-50"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        onClick={onClose}
      >
        <div
          className="flex w-full h-full"
          onClick={(e) => e.stopPropagation()}
        >
          <motion.div
            className="bg-white w-full h-full rounded-t-lg shadow-lg fixed bottom-0"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="p-4 bg-white rounded-lg shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  Search Flats
                </h2>
                <button
                  className="p-1 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100"
                  onClick={onClose}
                >
                  <HiXMark className="text-xl" />
                </button>
              </div>

              <form className="space-y-4" onSubmit={handleFormSubmit}>
                {/* Location Field */}

                <div className="bg-[#F5F5F5] border border-transparent hover:border-primary focus-within:border-primary focus-within:ring-1 focus-within:ring-primary rounded-md p-3 relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Where do you want to stay?
                  </label>
                  <div className="flex items-center">
                    <VscLocation className="text-primary mr-2" />
                    <input
                      type="text"
                      placeholder="Search Destinations"
                      className="w-full bg-transparent border-0 focus:outline-none"
                      value={location}
                      onChange={handleLocationChange}
                      onFocus={() =>
                        locationSuggestions.length > 0 &&
                        setShowSuggestions(true)
                      }
                      autoComplete="off"
                    />
                  </div>
                  {/* Suggestions Dropdown */}
                  {showSuggestions && locationSuggestions.length > 0 && (
                    <ul className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-56 overflow-y-auto z-20">
                      {locationSuggestions.map((item) => (
                        <li
                          key={item._id}
                          className="px-4 py-2 cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors duration-150"
                          onClick={() => handleSuggestionClick(item.location)}
                        >
                          <span className="flex items-center gap-2">
                            <VscLocation className="text-primary" />
                            {item.location}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Price Field */}
                <div className="bg-[#F5F5F5] border border-transparent hover:border-primary focus-within:border-primary focus-within:ring-1 focus-within:ring-primary rounded-md p-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Flat Price
                  </label>
                  <input
                    type="number"
                    placeholder="Enter max price"
                    className="w-full bg-transparent border-0 focus:outline-none"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                  />
                </div>

                {/* Category Field */}
                <div className="bg-[#F5F5F5] border border-transparent hover:border-primary focus-within:border-primary focus-within:ring-1 focus-within:ring-primary rounded-md p-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category of Land
                  </label>
                  <select
                    className="w-full bg-transparent border-0 focus:outline-none"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                  >
                    <option value="">Select category</option>
                    {loading ? (
                      <option disabled>Loading...</option>
                    ) : (
                      categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.categoryName}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                {/* Search Button */}
                <button
                  type="submit"
                  className="w-full py-3 bg-primary text-white font-bold rounded-md hover:bg-primary/90 flex items-center justify-center gap-2"
                >
                  <GoSearch />
                  Search Flats
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FlatSearchModal;
