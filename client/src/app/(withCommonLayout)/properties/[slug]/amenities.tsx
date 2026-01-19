"use client";
import Image from "next/image";
import React from "react";
import { Amenity as PropertyAmenity } from "@/types/propertyTypes";

// Use the imported Amenity type and extend it to include the image property
interface Amenity extends PropertyAmenity {
  image?: string;
}

interface AmenitiesProps {
  amenities: (Amenity | string)[];
}

const Amenities: React.FC<AmenitiesProps> = ({ amenities }) => {
  const IMAGE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001/api/v1";

  // If no amenities, don't render anything
  if (!amenities || amenities.length === 0) {
    return null;
  }

  // Filter out string amenities and only keep object amenities
  const validAmenities = amenities.filter(
    (amenity): amenity is Amenity =>
      typeof amenity === "object" && amenity !== null && "_id" in amenity
  );

  // If no valid amenities after filtering, don't render
  if (validAmenities.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-5 rounded-lg shadow-md mt-4">
      <h3 className="mb-4 text-lg font-semibold text-gray-800 border-b-2 border-primary/20 pb-2">
        Amenities
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {validAmenities.map((amenity) => (
          <div
            key={amenity._id}
            className="flex flex-col items-center p-2 border border-gray-100 rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="w-4 h-4 mb-2 relative">
              {amenity.image ? (
                <Image
                  src={`${IMAGE_URL}${amenity.image}`}
                  alt={amenity.label || "Amenity"}
                  fill
                  className="object-contain"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                  {(amenity.label || amenity.name || "Amenity")
                    .charAt(0)
                    .toUpperCase()}
                </div>
              )}
            </div>
            <span className="text-xs text-gray-700 text-center">
              {amenity.label || amenity.name || "Amenity"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Amenities;
