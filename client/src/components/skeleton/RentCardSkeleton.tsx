import React from "react";

const RentCardSkeleton = () => {
  return (
    <div className="rounded shadow-sm border border-gray-50 p-4 animate-pulse">
      <div className="h-[280px] w-full bg-gray-200 rounded mb-4"></div>
      <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
      <div className="h-3 w-1/2 bg-gray-200 rounded mb-4"></div>
      <div className="h-5 w-1/3 bg-gray-200 rounded mb-3"></div>

      <div className="flex flex-wrap gap-2">
        <div className="h-4 w-20 bg-gray-200 rounded" />
        <div className="h-4 w-20 bg-gray-200 rounded" />
        <div className="h-4 w-20 bg-gray-200 rounded" />
      </div>
    </div>
  );
};

export default RentCardSkeleton;
