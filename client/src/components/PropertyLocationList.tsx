"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import axios from "axios";
import { apiBaseUrl } from "@/config/config";
import { LucidePhoneCall, X } from "lucide-react";
import Image from "next/image";
import { Button } from "antd";

const PropertyLocationList = () => {
  const [locations, setLocations] = useState<any[]>([]);
  const [totalFeatured, setTotalFeatured] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [ModalOpen, setModalOpen] = useState(false);

  const PER_CATEGORY_LIMIT = 3;
  const OVERALL_LIMIT = 9;

  const handleCallNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };
  // const fetchProperties = useCallback(async () => {
  //   setLoading(true);
  //   try {
  //     const res = await axios.get(`${apiBaseUrl}/properties/featured`);
  //     const data: any = res?.data;

  //     if (data && Array.isArray(data.propertiesByCategory)) {
  //       setLocations(data.propertiesByCategory);
  //     } else if (Array.isArray(data)) {
  //       setLocations([{ category: { name: "All Properties" }, properties: data }]);
  //     } else {
  //       setLocations([]);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching properties:", error);
  //   }
  //   setLoading(false);
  // }, []);
  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${apiBaseUrl}/properties/featured`);

      // API returns an object like { totalFeatured, perCategoryLimit, overallLimit, propertiesByCategory: [...] }
      const data: any = res?.data;

      // If API returns a total count, store it for UI (e.g. "Showing X of Y")
      if (typeof data.totalFeatured === "number") {
        setTotalFeatured(data.totalFeatured);
      } else if (Array.isArray(data)) {
        // fallback when API returns array directly
        setTotalFeatured(data.length);
      } else {
        setTotalFeatured(null);
      }

      if (data && Array.isArray(data.propertiesByCategory)) {
        // Use limits from API when available, otherwise fall back to local constants
        const perCatLimit = typeof data.perCategoryLimit === "number" ? data.perCategoryLimit : PER_CATEGORY_LIMIT;
        const overallLimit = typeof data.overallLimit === "number" ? data.overallLimit : OVERALL_LIMIT;

        // Flatten properties while respecting per-category and overall limits
        const flattened: any[] = [];

        for (const bucket of data.propertiesByCategory) {
          if (!bucket || !Array.isArray(bucket.properties)) continue;

          const toTake = Math.min(Math.max(0, perCatLimit), bucket.properties.length);
          const slice = bucket.properties.slice(0, toTake);

          flattened.push(...slice);

          // stop if we reached overall limit
          if (flattened.length >= overallLimit) break;
        }

        // enforce overall limit
        setLocations(flattened.slice(0, overallLimit));
      } else if (Array.isArray(data)) {
        setLocations(data);
      } else {
        setLocations([]);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  return (
    <div className=" py-2 px-6">
      <div className="text-center mb-10 sm:mb-12 px-4">
        <h2 className="text-2xl sm:text-3xl md:text-3xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 leading-snug">
          Featured Properties
        </h2>
     
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="text-primary font-medium">
              Loading properties...
            </span>
          </div>
        </div>
      )}

      {!loading && (
        <div className="max-w-6xl w-full mt-8 mx-auto">
          <div className="flex items-center justify-between mb-6">
            {locations.length > 0 && (
              <div className="text-sm text-gray-500">
                {totalFeatured && totalFeatured > 0
                  ? `Showing ${locations.length} of ${totalFeatured} featured properties`
                  : `Showing ${locations.length} featured properties`}
              </div>
            )}
          </div>

          {locations.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-900"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-2m-2 0H7m5 0v-9a3 3 0 00-6 0v9m1.5 0h3m-3 0v-2.5A1.5 1.5 0 019 13.5v-2.5"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Properties Found
              </h3>
              <p className="text-gray-500 mb-4">
                We couldn&#39;t find any properties at the moment. Please check
                back later.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-10">
              {locations.map((prop) => {
                const img =
                  prop.coverImage || (prop.images && prop.images[0]) || null;
                const imgSrc = img ? `${apiBaseUrl}${img}` : null;
                return (
                  <div
                    key={prop._id}
                    className="bg-white border border-gray-200 overflow-hidden hover:shadow-lg hover:scale-102 transition-transform duration-300 relative"
                  >
                    <Link href={`/properties/${prop.slug}`} className="block">
                      <div className="h-58 overflow-hidden relative">
                        {imgSrc ? (
                          <Image
                            src={imgSrc}
                            alt={prop.title || "property image"}
                            fill
                            className="object-contain  hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-900">
                            No Image
                          </div>
                        )}

                        {/* Overlay badges in top-right corner */}
                        <div className="absolute top-2 right-2 flex gap-2 z-10">
                          {/* Listing Type Badge */}
                          <span className="px-2 py-1 bg-black/90 text-white rounded text-xs font-medium backdrop-blur-sm">
                            {prop.listingType}
                          </span>

                          {/* Publish Status Badge */}
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium backdrop-blur-sm ${prop.publishStatus === "PUBLISHED"
                              ? "bg-green-600/90 text-white"
                              : prop.publishStatus === "IN_PROGRESS"
                                ? "bg-primary/90 text-white"
                                : "bg-gray-500/90 text-white"
                              }`}
                          >
                            {prop.publishStatus === "PUBLISHED"
                              ? "Available"
                              : prop.publishStatus === "IN_PROGRESS"
                                ? "Pending"
                                : "Draft"}
                          </span>
                        </div>
                      </div>

                      <div className="p-4 flex flex-col gap-2">

                        <h3 className="text-lg font-semibold text-gray-900 hover:text-primary hover:underline line-clamp-2">
                          {prop?.title || prop?.location || "Untitled Property"}
                        </h3>

                        <div className="text-sm text-gray-600 flex flex-wrap gap-2  mt-2">
                          {
                            prop.location && (<span className="inline-flex items-center gap-1">
                              <svg
                                className="w-3 h-3 text-primary"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              {prop.location}
                            </span>)
                          }

                          {prop.category &&
                            typeof prop.category === "object" &&
                            prop.category.name && (
                              <span className="px-2 py-0.5 bg-gray-100 rounded text-xs  mt-4">
                                {prop.category.name}
                              </span>
                            )}
                          {prop.subcategory &&
                            typeof prop.subcategory === "object" &&
                            prop.subcategory.name && (
                              <span className="px-2 py-0.5 bg-gray-100 rounded text-xs  mt-4">
                                {prop.subcategory.name}
                              </span>
                            )}
                        </div>

                        {/* Property Details - Now aligned to the left in a row */}

                        <div className="text-xs text-gray-600 flex flex-wrap gap-3 items-center justify-start mb-2">
                          {prop.numberOfBedrooms && (
                            <span className="flex items-center gap-1">
                              <svg
                                className="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                                />
                              </svg>
                              {prop.numberOfBedrooms} rooms
                            </span>
                          )}

                          {prop.numberOfWashrooms && (
                            <span className="flex items-center gap-1">
                              <svg
                                className="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                                />
                              </svg>
                              {prop.numberOfWashrooms} baths
                            </span>
                          )}

                          {prop.numberOfBalconies && (
                            <span className="flex items-center gap-1">
                              <svg
                                className="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                                />
                              </svg>
                              {prop.numberOfBalconies} balconies
                            </span>
                          )}
                        </div>

                        <div className="mt-2 flex items-center justify-between">
                          <div className="text-sm text-gray-700 font-semibold">
                            {prop.price
                              ? `${prop.price.toLocaleString()} ${prop.priceUnit || "BDT"
                              }`
                              : "Price on request"}
                          </div>
                        </div>
                      </div>
                    </Link>

                    {/* Call Now Button - Outside of Link */}
                    <div className="absolute bottom-4 right-4 z-10">
                      <button
                        className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary shadow hover:bg-primary hover:scale-105 rounded-sm transition-all duration-300"
                        onClick={handleCallNow}
                      >
                        <LucidePhoneCall className="w-4 h-4 mr-2" />
                        <span>Call Now</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {/* Show "View More" only when there are more featured properties than shown */}
          {(!totalFeatured || totalFeatured > locations.length) && (
            <div className="mt-8 text-center">
              <Link href="/properties">
                <Button className="mt-2 mx-auto block px-6 py-3 bg-primary text-white font-semibold rounded-md shadow hover:bg-primary-dark transition-colors duration-200">
                  View More
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {ModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6 relative">
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-900 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center">
              <div className="mb-4">
                <LucidePhoneCall className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Contact Us
                </h3>
                <p className="text-gray-600 mb-6">
                  Please call us for booking. We are here to assist you.
                </p>
              </div>

              <div className="space-y-3">
                <a
                  href="tel:+801795148792"
                  className="inline-flex items-center justify-center w-full px-6 py-3 bg-primary/90 text-white font-semibold rounded-md shadow hover:bg-primary transition-colors duration-200"
                >
                  <LucidePhoneCall className="w-5 h-5 mr-2" />
                  Call +801795148792
                </a>

                <button
                  onClick={closeModal}
                  className="inline-block w-full px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-50 transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyLocationList