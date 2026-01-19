import React from "react";

const FullPageLoader = () => {
  return (
    <div className="w-full h-[100vh] bg-[red] flex items-center justify-center">
      <div className="loader" /> {/* Replace with your spinner or animation */}
      <p className="ml-2">Loading...</p>
    </div>
  );
};

export default FullPageLoader;
