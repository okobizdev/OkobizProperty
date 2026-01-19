
"use client";
import SearchTabs from "./SearchTabs";
import { useState } from "react";

const SearchContainer = () => {
  const [open, setOpen] = useState(false);

  return (
    <section>

      <div className="block md:hidden w-full text-center">
        <div className="w-full max-w-2xl mx-auto">
          <div className="relative  text-center">
            <div className="inline-flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-primary to-blue-800 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Property Search
              </h1>
            </div>

          </div>

          <div className="relative group p-2 ">

            <div
              className="flex items-center w-full px-4 py-4 bg-white border-2 border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:border-blue-400 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100"
              onClick={() => setOpen(true)}
            >

              <div className="flex-shrink-0 mr-4">
                <svg
                  className="w-6 h-6 text-gray-400 group-hover:text-blue-500 transition-colors duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <span className="text-gray-900 text-lg font-medium">
                Search here...
              </span>

            </div>


          </div>
        </div>

        {open && (
          <div
            className="fixed inset-0 z-[9999] flex items-start justify-center bg-black/40 px-4 pt-16 sm:pt-20"
            onClick={() => setOpen(false)}
          >
            <div
              className="w-full max-w-md mx-2 relative animate-fadeInUp max-h-[90vh] overflow-auto mt-6 sm:mt-8"
              onClick={e => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
            >
              <button
                className="absolute top-2 right-2 z-20 text-gray-900 hover:text-primary text-2xl font-bold  shadow-md w-10 h-10 flex items-center justify-center  border-gray-200"
                onClick={() => setOpen(false)}
                aria-label="Close"
                style={{ lineHeight: 1 }}
              >
                &times;
              </button>
              <div className="p-2 sm:p-4 w-full">
                <SearchTabs noWrapper />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="hidden md:block">
        <SearchTabs />
      </div>
    </section>
  );
};
export default SearchContainer;
