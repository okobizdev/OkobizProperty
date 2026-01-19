

import { Property } from "@/types/propertyTypes";
const PropertyDetails = ({ property } : { property: Property }) => {

    return ( 

<div className="bg-white p-5 rounded-lg shadow-md mt-4">
            <h3 className="mb-4 text-lg font-semibold text-gray-800 border-b-2 border-primary/20 pb-2">
              Property Details
            </h3>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="font-medium text-gray-500">Listing Type</span>
              <span className="font-medium text-gray-800">
                {property.listingType}
              </span>
            </div>
            {property.location && (
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="font-medium text-gray-500">Location</span>
                <span className="font-medium text-gray-800">
                  {property.location}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="font-medium text-gray-500">Size</span>
              <span className="font-medium text-gray-800">
                {property.size} {property.sizeUnit}
              </span>
            </div>
            {property.numberOfRooms && (
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="font-medium text-gray-500">Rooms</span>
                <span className="font-medium text-gray-800">
                  {property.numberOfRooms}
                </span>
              </div>
            )}
            {property.numberOfBedrooms && (
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="font-medium text-gray-500">Bedrooms</span>
                <span className="font-medium text-gray-800">
                  {property.numberOfBedrooms}
                </span>
              </div>
            )}
            {property.numberOfWashrooms && (
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="font-medium text-gray-500">Washrooms</span>
                <span className="font-medium text-gray-800">
                  {property.numberOfWashrooms}
                </span>
              </div>
            )}
            {property.numberOfBalconies && (
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="font-medium text-gray-500">Balconies</span>
                <span className="font-medium text-gray-800">
                  {property.numberOfBalconies}
                </span>
              </div>
            )}
            {property.airConditioning !== undefined && property.airConditioning == true && (
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="font-medium text-gray-500">Air Conditioning</span>
                <span className="font-medium text-gray-800">
                  Yes
                </span>
              </div>
            )}
            {property.rentDurationType && (
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="font-medium text-gray-500">Rent Duration</span>
                <span className="font-medium text-gray-800">
                  {property.rentDurationType}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center py-2">
              <span className="font-medium text-gray-500">Status</span>
              <span
                className={`font-medium px-3 text-xs py-1 rounded-full text-white ${
                  property.publishStatus === "SOLD"
                    ? "bg-red-500"
                    : property.publishStatus === "RENTED"
                    ? "bg-blue-500"
                    : "bg-green-500"
                }`}
              >
                {property.publishStatus === "SOLD"
                  ? "SOLD"
                  : property.publishStatus === "RENTED"
                  ? "RENTED"
                  : "AVAILABLE"}
              </span>
            </div>
          </div>

                );
}

export default PropertyDetails;