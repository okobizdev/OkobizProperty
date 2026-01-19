import React from "react";
import Image from "next/image";
import { Property } from "@/types/propertyTypes";
import Link from "next/link";
import { apiBaseUrl } from "@/config/config";

interface ShowPropertiesProps {
  properties: Property[];
  isLoading: boolean;
}

const ShowProperties: React.FC<ShowPropertiesProps> = ({
  properties,
  isLoading,
}) => {

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!properties || properties?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 bg-gradient-to-b from-gray-50 to-white rounded-sm border border-gray-100 shadow-sm">
        <div className="mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
        </div>


        <div className="text-center max-w-md">
          <h3 className="text-2xl font-semibold text-gray-900 mb-3">
            No Properties Found
          </h3>
          <p className="text-gray-600 text-base leading-relaxed mb-8">
            We couldn&#39;t find any properties matching your criteria in the selected location.
            Our team would love to help you find the perfect property.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-sm transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Contact Our Team
            </Link>

            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 font-medium border border-gray-300 rounded-sm transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Modify Search
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 p-4 bg-blue-50 rounded-sm border border-blue-100 max-w-md">
          <p className="text-sm text-blue-800 text-center">
            <span className="font-medium">💡 Tip:</span> Try expanding your search area or adjusting your filters for more results.
          </p>
        </div>
      </div>
    );
  }

  // const handleClick = (id: string) => {
  //   router.push(`/properties/${id}`);
  // };

  // Function to get status badge configuration
  const getStatusBadge = (
    publishStatus: string | undefined,
    property?: Property
  ) => {
    if (!publishStatus) return null;
    switch (publishStatus) {
      case "SOLD":
        return {
          text: "SOLD",
          bgColor: "bg-gradient-to-r from-red-600 to-red-500",
          textColor: "text-white",
          icon: "🏷️", // Trophy icon for successful sale
          overlay: false,
        };
      case "RENTED":
        return {
          text: "RENTED",
          bgColor: "bg-gradient-to-r from-blue-600 to-blue-500",
          textColor: "text-white",
          icon: "🔑", // Key icon for rented property
          overlay: false,
        };
      case "PUBLISHED":
        // Check if property is for rent or sale 
        if (property?.listingType === "RENT") {
          return {
            text: "Available",
            bgColor: "bg-gradient-to-r from-indigo-600 to-indigo-500",
            textColor: "text-white",
            // icon: "🔑", // Key icon for rental property
            overlay: false,
          };
        } else {
          return {
            text: "Available",
            bgColor: "bg-gradient-to-r from-emerald-600 to-emerald-500",
            textColor: "text-white",
            // icon: "🏡", // House icon for property for sale
            overlay: false,
          };
        }
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-8 py-2">
      {properties.map((property: Property) => {
        const statusBadge = getStatusBadge(property.publishStatus, property);
        const isUnavailable =
          property.publishStatus === "SOLD" ||
          property.publishStatus === "RENTED";

        return (
          <Link href={`/properties/${property.slug}`} key={property._id}>
            <div
              key={property._id}
              className="border border-gray-100 rounded-xs overflow-hidden bg-white shadow-lg transition-transform duration-200 ease-in-out cursor-pointer hover:translate-y-[-2px] hover:shadow-lg"

            >
              <div className="relative h-52 overflow-hidden">
                {property.coverImage && (
                  <Image
                    src={`${apiBaseUrl}${property.coverImage}`}
                    alt={property.title}
                    fill
                    className="object-contain"
                    priority
                  />
                )}

                {/* Status Badge - Top Right Corner */}
                {statusBadge && (
                  <div className="absolute top-3 right-3 z-10">
                    <div
                      className={`${statusBadge.bgColor} ${statusBadge.textColor} px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg border border-white/30 backdrop-blur-sm`}
                    >
                      <span className="text-sm">{statusBadge.icon}</span>
                      <span className="tracking-wider">{statusBadge.text}</span>
                    </div>
                  </div>
                )}

                {statusBadge?.overlay && (
                  <div className="absolute inset-0 bg-white bg-opacity-10 flex items-center justify-center">
                    <div
                      className={`${statusBadge.bgColor} ${statusBadge.textColor} px-6 py-3 rounded-sm text-lg font-bold shadow-xl border-2 border-white`}
                    >
                      {statusBadge.icon} {statusBadge.text}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="flex justify-between items-start mb-2 h-12">
                  <h3
                    className={`text-lg font-semibold leading-snug ${isUnavailable ? "text-gray-600" : "text-gray-800"
                      }`}
                  >
                    {property.title}
                  </h3>

                  {/* Status badge in title area for mobile/small screens */}
                  {/* {statusBadge && !statusBadge.overlay && (
                  <div className={`${statusBadge.bgColor} ${statusBadge.textColor} px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ml-2 flex-shrink-0`}>
                    <span>{statusBadge.icon}</span>
                    <span className="hidden sm:inline">{statusBadge.text}</span>
                  </div>
                )} */}
                </div>

                {/* <p
                  className={`mb-3 text-sm leading-relaxed line-clamp-2 ${isUnavailable ? "text-gray-400" : "text-gray-500"
                    }`}
                >
                  {property.description}
                </p> */}

                {/* Only show price for available properties */}
                {!isUnavailable && (
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xl font-bold text-primary">
                      {property.price} {property.priceUnit}{" "}
                      {property.rentDurationType ? (
                        <span className="text-xs text-gray-500">
                          /{property.rentDurationType}
                        </span>
                      ) : (
                        ""
                      )}
                    </span>
                  </div>
                )}

                {/* Show status message for sold/rented properties */}
                {isUnavailable && (
                  <div className="mb-3">
                    <span className="text-sm text-gray-400 font-medium">
                      No longer available
                    </span>
                  </div>
                )}

                <div className="mb-2 flex  gap-4 flex-wrap h-12">



                  {property.size && (
                    <span className="text-xs text-gray-400">
                      📐Size: {property.size} {property.sizeUnit}
                    </span>
                  )}


                  {property.numberOfBedrooms && (
                    <span className="text-xs text-gray-400">
                      🏠{property.numberOfBedrooms} bedrooms
                    </span>
                  )}


                  {property.numberOfWashrooms && (
                    <span className="text-xs text-gray-400">
                      {property.numberOfWashrooms} bathrooms </span>

                  )}

                  {property.numberOfBalconies && (
                    <span className="text-xs text-gray-400">
                      {property.numberOfBalconies} balconies </span>

                  )}


                  <span
                    className={`text-xs ${isUnavailable ? "text-gray-400" : "text-gray-400"
                      }`}
                  >
                    📍 {property.location}
                  </span>

                </div>

                <div className="flex justify-between items-center gap-2 flex-wrap">
                  <div className="flex gap-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${isUnavailable
                        ? "bg-gray-100 text-gray-400"
                        : "bg-gray-200 text-gray-500"
                        }`}
                    >
                      {typeof property.category === "object" &&
                        property.category !== null &&
                        "name" in property.category
                        ? property.category.name
                        : typeof property.category === "string"
                          ? property.category
                          : "-"}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full text-white ${isUnavailable ? "bg-gray-400" : "bg-primary"
                        }`}
                    >
                      {typeof property.subcategory === "object" &&
                        property.subcategory !== null &&
                        "name" in property.subcategory
                        ? property.subcategory.name
                        : typeof property.subcategory === "string"
                          ? property.subcategory
                          : "-"}
                    </span>
                  </div>
                  <Link
                    href={`/properties/${property.slug}`} >
                    <button
                      className={`py-2 px-4 text-white border-none rounded-md text-sm font-medium cursor-pointer transition-colors duration-200 ease-in-out ${isUnavailable
                        ? "bg-gray-400 hover:bg-gray-500"
                        : "bg-primary hover:bg-primary"
                        }`}
                    >
                      {isUnavailable ? "View Details" : "View Details"}
                    </button> </Link>


                </div>
              </div>
            </div>
          </Link>

        );
      })}
    </div>
  );
};

export default ShowProperties;
