"use client";
import Image from "next/image";
import React, { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import { apiBaseUrl } from "@/config/config";

interface Props {
  images: string[];
  setOpenGallery: React.Dispatch<React.SetStateAction<boolean>>;
}

const ImageModel: React.FC<Props> = ({ images, setOpenGallery }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="">
      {/* Back Button */}
      <div onClick={() => setOpenGallery(false)} className="mb-4 mx-4 mt-8">
        <div className="px-1 py-1 border inline-flex rounded cursor-pointer">
          <IoIosArrowBack className="text-2xl" />
        </div>
      </div>

      {/* Image Content */}
      <div className="flex flex-col gap-4 items-center">
        {/* Main Image */}
        <div
          className="md:h-[420px] h-[280px] w-[810px] max-w-full cursor-pointer"
          onClick={() => openLightbox(0)}
        >
          {images && (
            <Image
              src={apiBaseUrl + images[0]}
              alt="Main Image"
              width={810}
              height={420}
              className="w-full h-full object-cover rounded"
            />
          )}
        </div>

        {/* Grid of Images */}
        <div className="grid grid-cols-2 gap-4">
          {images &&
            images?.map((img, index) => (
              <div
                key={index}
                className="md:h-[205px] h-[160px] w-[400px] max-w-full cursor-pointer"
                onClick={() => openLightbox(index)}
              >
                {img && (
                  <Image
                    src={apiBaseUrl + img}
                    alt={`Image ${index + 1}`}
                    width={400}
                    height={205}
                    className="w-full h-full object-cover rounded"
                  />
                )}
              </div>
            ))}
        </div>
      </div>

      {/* Lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={images?.map((img) => ({ src: apiBaseUrl + img }))}
        plugins={[Zoom]}
      />
    </div>
  );
};

export default ImageModel;
