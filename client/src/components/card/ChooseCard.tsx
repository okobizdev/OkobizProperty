import { poppins } from "@/app/font";
import ChooseModal from "@/components/modals/ChooseModal";
import { apiBaseUrl } from "@/config/config";
import { IChoose } from "@/types";
import Image from "next/image";
import React, { useState } from "react";

interface Props {
  choose: IChoose;
}

const ChooseCard: React.FC<Props> = ({ choose }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);

  // Check if the description text exceeds two lines using the ref
  const textRef = React.useRef<HTMLParagraphElement>(null);

  React.useEffect(() => {
    const checkTruncation = () => {
      if (textRef.current) {
        setIsTruncated(
          textRef.current.scrollHeight > textRef.current.clientHeight
        );
      }
    };

    checkTruncation();
    window.addEventListener("resize", checkTruncation);
    return () => {
      window.removeEventListener("resize", checkTruncation);
    };
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="group">
      <div className="border relative border-primary/5 duration-300 cursor-pointer shadow  p-4 group-hover:mt-[-12px]">
        <div className="h-[200px] w-full mx-auto ">
          <Image
            src={apiBaseUrl + choose.whyChooseUsIcon}
            alt=""
            width={800}
            height={800}
            className="w-full h-full"
          />
        </div>
        <h4
          className={`text-base font-medium tracking-wider line-clamp-1 mt-1 group-hover:text-[#262626] duration-300 ${poppins.className}`}
        >
          {choose.whyChooseUsTitle}
        </h4>
        <p
          ref={textRef}
          className="line-clamp-2 mt-2 text-[#262626]/70 group-hover:text-[#262626] duration-300"
        >
          {choose.whyChooseUsDescription}
        </p>
        {isTruncated && (
          <button
            onClick={openModal}
            className="text-primary group-hover:text-[#262626] mt-2 text-sm font-medium absolute top-2 right-3 cursor-pointer"
          ></button>
        )}
      </div>
      {isModalOpen && <ChooseModal closeModal={closeModal} choose={choose} />}
    </div>
  );
};

export default ChooseCard;
