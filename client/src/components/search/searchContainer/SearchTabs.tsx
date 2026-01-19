"use client";
import { Select, AutoComplete } from "antd";
import { useCategories } from "@/hooks/useCategories";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiBaseUrl } from "@/config/config";

interface SearchTabsProps {
  noWrapper?: boolean;
}

const SearchTabs = ({ noWrapper }: SearchTabsProps) => {
  const { categories } = useCategories();
  const searchParams = useSearchParams();
  const [type, setType] = useState<"sell" | "rent">("sell");
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [location, setLocation] = useState("");
  const [locationOptions, setLocationOptions] = useState<{ value: string; label: string }[]>([]);  // New state for dropdown options
  const router = useRouter();

  // Assume baseUrl is defined; replace with your actual base URL (e.g., from env or config)



  useEffect(() => {
    const urlLocation = searchParams.get("location") || "";
    setLocation(urlLocation);
  }, [searchParams]);

  // Function to fetch location suggestions
  const fetchLocationSuggestions = async (searchValue: string) => {
    if (!searchValue.trim()) {
      setLocationOptions([]);
      return;
    }
    try {
      const response = await fetch(`${apiBaseUrl}/location/search/${encodeURIComponent(searchValue)}`);
      if (!response.ok) throw new Error("Failed to fetch locations");
      const data = await response.json();
      const options = data.data.map((item: { location: string }) => ({
        value: item.location,
        label: item.location,
      }));
      setLocationOptions(options);
    } catch (error) {
      console.error("Error fetching locations:", error);
      setLocationOptions([]);
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    params.set("listingType", type);
    if (category) params.set("category", category);
    params.set("location", location || "");

    params.delete("_rsc");
    router.push(`/properties?${params.toString()}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  if (noWrapper) {

    return (
      <div className="w-full mx-auto ">
        <div className="backdrop-blur-xl bg-white/20 border border-white/20 rounded-3xl shadow-2xl overflow-hidden relative">
          <div className="relative sm:p-8 p-5  text-center">
            <div className="inline-flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-primary to-blue-800 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Property Search
              </h1>
            </div>
            <p className="text-gray-900 text-base sm:text-lg max-w-2xl mx-auto">
              Discover your perfect property from our extensive collection of premium listings
            </p>
          </div>
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="rounded-2xl p-2 inline-flex w-full max-w-xs sm:max-w-none">

              <button
                onClick={() => {
                  setType("sell");
                  setCategory(undefined);
                }}
                className={`flex-1 flex cursor-pointer items-center gap-2 sm:gap-3 px-3 sm:px-6 py-1 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-500 transform ${type === "sell"
                  ? "bg-white text-primary shadow-xl scale-105 ring-2 ring-primary/20 backdrop-blur-sm"
                  : "text-gray-900 hover:text-primary hover:bg-white/50"
                  }`}
              >
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${type === "sell" ? "bg-primary/10" : "bg-gray-200/50"
                  }`}>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                </div>
                <span>Buy Property</span>
              </button>
              <button
                onClick={() => {
                  setType("rent");
                  setCategory(undefined);
                }}
                className={`flex-1 flex cursor-pointer items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-500 transform ${type === "rent"
                  ? "bg-white text-primary shadow-xl scale-105 ring-2 ring-primary/20 backdrop-blur-sm"
                  : "text-gray-900 hover:text-primary hover:bg-white/50"
                  }`}
              >
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${type === "rent" ? "bg-primary/10" : "bg-gray-200/50"
                  }`}>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                </div>
                <span>Rent Property</span>
              </button>
            </div>
          </div>
          <div className="px-2 sm:px-8 pb-6 sm:pb-8 relative">
            <div className="grid grid-cols-1 gap-4 sm:gap-6 items-end lg:grid-cols-12">
              {/* ...existing code for form fields and button... */}
              <div className="lg:col-span-4">
                {/* ...existing code for category select... */}
                <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3 flex items-center gap-1 sm:gap-2">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 bg-primary/10 rounded-md flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-2m-2 0H7m5 0v-9a3 3 0 00-6 0v9m1.5 0h3m-3 0v-2.5A1.5 1.5 0 019 13.5v-2.5" />
                    </svg>
                  </div>
                  Category
                </label>
                <div className="relative group">
                  <Select
                    placeholder="All Categories"
                    className="w-full custom-select placeholder-black"
                    size="large"
                    value={category}
                    onChange={setCategory}
                    options={categories?.map((cat) => ({
                      value: cat._id,
                      label: cat.name,
                    }))}
                    allowClear
                    style={{
                      height: '48px',
                      fontSize: '14px',
                    }}
                    dropdownStyle={{
                      borderRadius: '16px',
                      backdropFilter: 'blur(16px)',
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
                    }}
                  />
                </div>
              </div>
              <div className="lg:col-span-4">
                {/* ...existing code for location input... */}
                <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3 flex items-center gap-1 sm:gap-2">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 bg-primary/10 rounded-md flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  Location
                </label>
                <div className="relative group">
                  <AutoComplete
                    placeholder="Enter city, area, or landmark..."
                    className="w-full pl-10 sm:pl-12 custom-input placeholder-black focus:!outline-none focus:!ring-1"
                    size="large"
                    value={location}
                    options={locationOptions}
                    onChange={(value) => setLocation(value)}
                    onSearch={fetchLocationSuggestions}
                    onSelect={(value) => setLocation(value)}
                    onKeyDown={handleKeyPress}
                    style={{
                      height: '48px',
                      fontSize: '14px',
                      borderRadius: '14px',
                      border: '2px solid rgba(229, 231, 235, 0.3)',
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(8px)',
                      transition: 'all 0.3s ease-in-out',
                    }}
                    onFocus={(e) => {
                      (e.target as HTMLElement).style.borderColor = '#F2693C';
                      (e.target as HTMLElement).style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                      (e.target as HTMLElement).style.boxShadow = '0 0 0 4px rgba(242, 105, 60, 0.1)';
                      (e.target as HTMLElement).style.transform = 'translateY(-2px)';
                    }}
                    onBlur={(e) => {
                      (e.target as HTMLElement).style.borderColor = 'rgba(229, 231, 235, 0.3)';
                      (e.target as HTMLElement).style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
                      (e.target as HTMLElement).style.boxShadow = 'none';
                      (e.target as HTMLElement).style.transform = 'translateY(0px)';
                    }}
                  />
                  <style>{`
                    .placeholder-black::placeholder {
                      color: #000 !important;
                      opacity: 1 !important;
                    }
                  `}</style>
                </div>
              </div>
              <div className="lg:col-span-4">

                <button
                  onClick={handleSearch}
                  className="w-full h-12 sm:h-14 cursor-pointer bg-gradient-to-r from-primary  to-blue-900 hover:from-primary/90 hover:via-orange-600 hover:to-red-600 text-white font-bold rounded-2xl shadow-2xl hover:shadow-primary/25 transform hover:scale-105 hover:-translate-y-1 transition-all duration-500 flex items-center justify-center gap-3 sm:gap-4 focus:outline-none focus:ring-4 focus:ring-primary/30 group relative overflow-hidden text-base sm:text-lg"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-all duration-300">
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <span className="relative z-10">Search </span>
                  <div className="transform group-hover:translate-x-1 transition-transform duration-300">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }
  // Default: desktop and non-modal, show with background/blur wrapper
  return (
    <div className="md:max-w-3xl lg:max-w-5xl  mx-auto">
      <div className="backdrop-blur-xs bg-white/10 border border-white/20 rounded-3xl shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-35 h-35 bg-gradient-to-br from-primary/10 to-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-500/10 to-primary/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative p-5 sm:p-8 text-center">
          <div className="inline-flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Property Search
            </h1>
          </div>
          <p className="text-gray-900 text-base md:text-md max-w-2xl mx-auto">
            Discover your perfect property from our extensive collection of premium listings
          </p>
        </div>
        <div className="flex justify-center mb-2">
          <div className="backdrop-blur-sm bg-gray-100/50 p-1 rounded-2xl border border-gray-200/50 shadow-inner flex justify-center w-full max-w-xs sm:max-w-none md:w-auto md:max-w-none md:mx-auto">

            <button
              onClick={() => {
                setType("sell");
                setCategory(undefined);
              }}
              className={`flex flex-shrink-0 cursor-pointer items-center gap-2 sm:gap-3 px-3 sm:px-6 py-1 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-500 transform ${type === "sell"
                ? "bg-white text-primary shadow-xl scale-105 ring-2 ring-primary/20 backdrop-blur-sm"
                : "text-gray-900 hover:text-primary hover:bg-white/50"
                } md:w-auto`}
              style={{ minWidth: 120, marginRight: 8 }}
            >
              <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${type === "sell" ? "bg-primary/10" : "bg-gray-200/50"
                }`}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
              <span>Buy Property</span>
            </button>
            <button
              onClick={() => {
                setType("rent");
                setCategory(undefined);
              }}
              className={`flex flex-shrink-0 cursor-pointer items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-500 transform ${type === "rent"
                ? "bg-white text-primary shadow-xl scale-105 ring-2 ring-primary/20 backdrop-blur-sm"
                : "text-gray-900 hover:text-primary hover:bg-white/50"
                } md:w-auto`}
              style={{ minWidth: 120 }}
            >
              <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${type === "rent" ? "bg-primary/10" : "bg-gray-200/50"
                }`}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
              </div>
              <span>Rent Property</span>
            </button>
          </div>
        </div>
        <div className="px-2 sm:px-8 pb-6 sm:pb-8 relative">
          <div className="grid grid-cols-1 gap-4 sm:gap-6 items-end lg:grid-cols-12">

            <div className="lg:col-span-4">

              <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3 flex items-center gap-1 sm:gap-2">
                <div className="w-4 h-4 sm:w-5 sm:h-5 bg-primary/10 rounded-md flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-2m-2 0H7m5 0v-9a3 3 0 00-6 0v9m1.5 0h3m-3 0v-2.5A1.5 1.5 0 019 13.5v-2.5" />
                  </svg>
                </div>
                Category
              </label>
              <div className="relative group">
                <Select
                  placeholder="All Categories"
                  className="w-full custom-select"
                  size="large"
                  value={category}
                  onChange={setCategory}
                  options={categories?.map((cat) => ({
                    value: cat._id,
                    label: cat.name,
                  }))}
                  allowClear
                  style={{
                    height: '48px',
                    fontSize: '14px',
                  }}
                  dropdownStyle={{
                    borderRadius: '16px',
                    backdropFilter: 'blur(16px)',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
                  }}
                />
              </div>
            </div>
            <div className="lg:col-span-4">

              <label className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3 flex items-center gap-1 sm:gap-2">
                <div className="w-4 h-4 sm:w-5 sm:h-5 bg-primary/10 rounded-md flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                Location
              </label>
              <div className="relative group">
                <AutoComplete
                  placeholder="Enter city, area, or landmark..."
                  className="w-full pl-10 sm:pl-12 custom-input placeholder-black focus:!outline-none  focus:!ring-1"
                  size="large"
                  value={location}
                  options={locationOptions}
                  onChange={(value) => setLocation(value)}
                  onSearch={fetchLocationSuggestions}  // Fetch suggestions on input
                  onSelect={(value) => setLocation(value)}  // Set location on selection
                  onKeyDown={handleKeyPress}
                  style={{
                    height: '48px',
                    fontSize: '14px',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    transition: 'all 0.3s ease-in-out',
                  }}


                />
              </div>
            </div>
            <div className="lg:col-span-4">
              {/* ...existing code for search button... */}
              <button
                onClick={handleSearch}
                className="w-full h-12 sm:h-14 cursor-pointer bg-primary text-white font-bold rounded-2xl shadow-2xl hover:shadow-primary/25 transform hover:scale-105 hover:-translate-y-1 transition-all duration-500 flex items-center justify-center gap-3 sm:gap-4 focus:outline-none focus:ring-4 focus:ring-primary/30 group relative overflow-hidden text-base sm:text-lg"
              >
                <div className="absolute inset-0 bg-primary hover:text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-all duration-300">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <span className="relative z-10">Search </span>
                <div className="transform group-hover:translate-x-1 transition-transform duration-300">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchTabs;