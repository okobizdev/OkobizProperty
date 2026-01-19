import React from "react";
import { useSubcategories } from "@/hooks/useSubcategories";
import { useCategories } from "@/hooks/useCategories";
import { useRouter, useSearchParams } from "next/navigation";

const ShowSubcategories = () => {
  const {
    subcategories,
    loading: subLoading,
    error: subError,
  } = useSubcategories();
  const { categories, loading: catLoading, error: catError } = useCategories();
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedSubcategoryId = searchParams.get("subcategory");
  const selectedCategoryId = searchParams.get("category");
  const selectedListingType = searchParams.get("listingType");
  // Collapsible for mobile (must be before any return)
  const [open, setOpen] = React.useState(false);

  const handleFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.push(`?${params.toString()}`);
  };

  if (subLoading || catLoading) return <div>Loading options...</div>;
  if (subError || catError) return <div>Error: {subError || catError}</div>;

  // Filter subcategories based on selected category
  let filteredSubcategories = selectedCategoryId
    ? subcategories.filter(
      (subcat) =>
        (typeof subcat.category === "string" && subcat.category === selectedCategoryId) ||
        (typeof subcat.category === "object" &&
          subcat.category !== null &&
          "_id" in subcat.category &&
          (subcat.category as { _id: string })._id === selectedCategoryId)
    )
    : subcategories;

  // Further filter subcategories based on listingType if it exists
  if (selectedListingType) {
    const upperCaseListingType = selectedListingType.toString().toUpperCase();

    filteredSubcategories = filteredSubcategories.filter(
      (subcat) => {
        // Check if the selected listing type is in the allowedListingTypes array
        if (Array.isArray(subcat.allowedListingTypes)) {
          return subcat.allowedListingTypes.includes(upperCaseListingType as "SELL" | "RENT");
        }
        // Fallback: if allowedListingTypes is not an array, return false
        return false;
      }
    );
  }

  return (
    <nav className="">
      <div className="flex md:hidden items-center justify-between mb-2 px-4">
        <span className="font-semibold text-base text-gray-800">Categories & Filters</span>
        <button
          className="px-3 py-1 rounded bg-primary text-white text-sm font-semibold shadow"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Hide" : "Show"}
        </button>
      </div>
      <div className={`flex-col md:flex-row md:flex flex-wrap items-center gap-3 transition-all duration-300 ${open ? 'flex' : 'hidden'} md:flex`}>
        <div className="flex items-center gap-2 flex-wrap bg-gray-10 border border-gray-100 rounded-sm px-4 py-2 shadow-xs">
          {filteredSubcategories.map((subcat) => (
            <button
              key={subcat._id}
              onClick={() => handleFilter("subcategory", subcat._id)}
              className={`px-5 py-2 rounded-sm font-semibold text-sm transition-all duration-200 cursor-pointer
                ${selectedSubcategoryId === subcat._id
                  ? "bg-primary text-white shadow"
                  : "bg-white text-gray-700 hover:bg-primary/20 hover:text-primary"
                }`}
            >
              {subcat.name}
            </button>
          ))}
        </div>


        <div className="flex items-center gap-2 ml-auto flex-wrap bg-gray-10 border border-gray-100 rounded-full px-4 py-2 shadow-xs">
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => handleFilter("category", cat._id)}
              className={`px-5 py-2 rounded-full font-semibold text-sm transition-all duration-200 cursor-pointer
                ${selectedCategoryId === cat._id
                  ? "bg-primary text-white shadow"
                  : "bg-white text-gray-700 hover:bg-primary/20 hover:text-primary"
                }`}
            >
              {cat.name}
            </button>
          ))}
        </div>


        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-full px-2 py-1 gap-2 ml-2 shadow-xs">
          <button
            onClick={() => handleFilter("listingType", "sell")}
            className={`px-5 py-2 rounded-full font-semibold text-sm transition-all duration-200 cursor-pointer
              ${searchParams.get("listingType") === "sell"
                ? "bg-primary text-white shadow"
                : "bg-transparent text-gray-700 hover:bg-primary/20 hover:text-primary"
              }`}
          >
            Buy
          </button>
          <button
            onClick={() => handleFilter("listingType", "rent")}
            className={`px-5 py-2 rounded-full font-semibold text-sm transition-all duration-200 cursor-pointer
              ${searchParams.get("listingType") === "rent"
                ? "bg-primary text-white shadow"
                : "bg-transparent text-gray-700 hover:bg-primary/20 hover:text-primary"
              }`}
          >
            Rent
          </button>
        </div>
      </div>
    </nav>
  );
};

export default ShowSubcategories;