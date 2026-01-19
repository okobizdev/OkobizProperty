import { poppins } from "@/app/font";
import React from "react";

interface Props {
  title: string;
  subTitle: string;
}
const SectionTitle: React.FC<Props> = ({ title, subTitle }) => {
  return (
    <div className="flex items-center justify-center flex-col gap-3">
      <h2
        className={`xl:text-2xl lg:text-2xl md:text-2xl text-xl font-semibold capitalize 2xl:w-[60%] xl:w-[60%] lg:w-[65%] w-full text-center text-[#262626]/90 ${poppins.className}`}
      >
        {title}
      </h2>
      <p
        className={`text-thirdly lg:w-[50%] md:w-[60%] text-center text-sm ${poppins.className}`}
      >
        {subTitle}
      </p>
    </div>
  );
};

export default SectionTitle;
