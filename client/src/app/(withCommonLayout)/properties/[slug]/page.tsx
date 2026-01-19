"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { getPropertyBySlug } from "@/services/properties";
import { Property } from "@/types/propertyTypes";
import Booking from "./booking-v2"; // Import the booking component
import Amenities from "./amenities"; // Import the amenities component
import useAuth from "@/hooks/useAuth";
import PropertyDetails from "./propertyDetails";
import { apiBaseUrl } from "@/config/config";

const PropertyDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [showVideo, setShowVideo] = useState(false); // State to toggle between video and image

  const { user } = useAuth();

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
        if (slug) {
          const data = await getPropertyBySlug(slug);
          console.log(data);
          setProperty(data);
          setCoverImage(data.coverImage ?? null);
        }
      } catch (err) {
        setError("Failed to load property details");
        console.error("Error fetching property:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [params.slug]);

  // Helper function to extract YouTube video ID
  const getYouTubeThumbnail = (url: string) => {
    const videoIdMatch = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    return videoIdMatch
      ? `https://img.youtube.com/vi/${videoIdMatch[1]}/hqdefault.jpg`
      : null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px] text-lg text-gray-500">
        Loading property details...
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] gap-4">
        <div className="text-lg text-gray-500">
          {error || "Property not found"}
        </div>
        <button
          onClick={() => router.back()}
          className="px-5 py-2.5 bg-primary text-white rounded-md cursor-pointer"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <button
        className="inline-flex mt-2 items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-800 text-sm mb-5 cursor-pointer hover:bg-gray-200"
        onClick={() => router.back()}
      >
        ← Back to Properties
      </button>

      <div className="flex flex-col gap-4 mb-8">
        <h1 className="text-2xl font-bold text-gray-800 m-0">
          {property.title}
        </h1>
        <div className="flex items-center gap-2 text-gray-500 text-base">
          {property.location &&(
            <>
            <span>📍</span>
          <span>{property.location}</span></>
          )
          
          }
          
        </div>
        {property.publishStatus == "RENTED" ||
        property.publishStatus == "SOLD" ? (
          <div className="text-red-500 font-semibold">
            This property is {property.publishStatus.toLowerCase()}.
          </div>
        ) : (
          <div className="text-xl font-bold text-primary m-0">
            {property.price} {property.priceUnit}{" "}
            <span className="text-gray-500 text-xs">
              {" "}
              {property?.listingType == "RENT" &&
                property?.rentDurationType == "FLEXIBLE" &&
                `/ NIGHT`}
            </span>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 grid-cols-1 gap-y-6 lg:gap-x-4 md:gap-x-2">
        <div className="col-span-2 gap-y-6 ">
          {/* Main Display Area */}
          <div className="relative h-[14rem] mx-2  lg:h-[34rem] md:h-[20rem]  rounded-lg overflow-hidden shadow-md">
            {showVideo && property.video ? (
              <iframe
                width="100%"
                height="100%"
                src={property.video.replace("watch?v=", "embed/")}
                title="Property Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="object-cover"
              ></iframe>
            ) : (
              <Image
                src={`${apiBaseUrl}${coverImage}`}
                alt={property.title}
                fill
                className="object-contain"
                priority
              />
            )}
          </div>

          {/* Thumbnails Section */}
          <div className="flex gap-2 mt-4">
            {property.images?.map((image, index) => (
              <div
                key={index}
                className="w-20 h-full rounded-lg overflow-hidden border border-gray-300 cursor-pointer hover:border-primary"
                onClick={() => {
                  setCoverImage(image);
                  setShowVideo(false); // Ensure video is not shown when an image is clicked
                }}
              >
                <Image
                  src={`${apiBaseUrl}${image}`}
                  alt={`Thumbnail ${index + 1}`}
                  width={80}
                  height={80}
                  className="object-cover *:w-full h-full"
                />
              </div>
            ))}

            {/* YouTube Video Thumbnail */}
            {property.video && (
              <div
                className="w-20 h-20 rounded-lg overflow-hidden border border-gray-300 cursor-pointer hover:border-primary"
                onClick={() => setShowVideo(true)}
              >
                <Image
                  src={
                    getYouTubeThumbnail(property.video) ||
                    "default-placeholder.jpg"
                  }
                  alt="Video Thumbnail"
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
              </div>
            )}
          </div>
          <PropertyDetails property={property} />

          {property.amenities && property.amenities.length > 0 && (
            <Amenities amenities={property.amenities} />
          )}

          <div className="bg-white p-6 rounded-lg shadow-md mt-4">
  <h3 className="mb-4 text-lg font-semibold text-gray-800 border-b-2 border-primary/20 pb-2">
    Description
  </h3>

<div
  className="property-description"
  dangerouslySetInnerHTML={{ __html: property.description || "" }}
/>

  <div className="flex gap-2 flex-wrap mt-4">
    <span className="px-3 py-1 bg-gray-200 rounded-full text-sm font-medium text-gray-500">
      {typeof property.category === "object" && property.category !== null
        ? property.category.name
        : typeof property.category === "string"
        ? property.category
        : "Category"}
    </span> 
  </div>
</div>

        </div>
        <div className="w-full mx-auto col-span-1  gap-y-6">
          <div className="bg-white p-5 rounded-lg shadow-md">
            <Booking
              propertyId={property._id}
              user={user}
              property={property}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsPage;
