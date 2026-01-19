import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSubcategories } from "@/hooks/useSubcategories";

interface FilterField {
  name: string;
  label: string;
  type:
  | "text"
  | "number"
  | "boolean"
  | "date"
  | "select"
  | "multiselect"
  | "measurement"
  | "range";
  options?: string[];
  placeholder?: string;
  supportedUnits?: string[];
  defaultUnit?: string;
  validation?: { min?: number; max?: number; pattern?: string };
  displayOrder?: number;
}

const Filterings: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { subcategories, loading, error } = useSubcategories();
  const [locationInput, setLocationInput] = useState(searchParams.get("location") || "");
  const [debouncedLocation, setDebouncedLocation] = useState(searchParams.get("location") || "");
  // Collapsible for mobile
  const [open, setOpen] = useState(false);

  const selectedSubcategoryId = searchParams.get("subcategory") || undefined;
  const selectedSubcategory = useMemo(
    () => subcategories.find((s) => s._id === selectedSubcategoryId),
    [subcategories, selectedSubcategoryId]
  );

  const fields: FilterField[] = useMemo(
    () => (selectedSubcategory?.filterConfig?.fields as FilterField[]) || [],
    [selectedSubcategory]
  );


  const setParam = useCallback(
    (key: string, value?: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (!value) params.delete(key);
      else params.set(key, value);
      router.push(`?${params.toString()}`);
    },
    [router, searchParams]
  );

  const getParam = useCallback(
    (key: string) => searchParams.get(key) ?? "",
    [searchParams]
  );

  // Keep locationInput in sync with URL param (when URL changes from outside, e.g. SearchTabs)
  useEffect(() => {
    const urlLocation = searchParams.get("location") || "";
    setLocationInput(urlLocation);
    setDebouncedLocation(urlLocation);
  }, [searchParams]);

  // Debounce logic for location input (when user types in Filterings)
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedLocation(locationInput);
    }, 500);
    return () => clearTimeout(timeout);
  }, [locationInput]);

  // Update the query parameter when debouncedLocation changes
  useEffect(() => {
    setParam("location", debouncedLocation);
  }, [debouncedLocation, setParam]);

  // Reusable function to render field based on type
  const renderField = useCallback(
    (field: FilterField) => {
      if (field.type === "range") {
        const minKey = `${field.name}_min`;
        const maxKey = `${field.name}_max`;
        return (
          <div key={field.name}>
            <label className="block mb-1 sm:mb-2 font-medium text-gray-800 text-xs sm:text-sm">
              {field.label}
            </label>
            <div className="flex gap-1 sm:gap-2 items-center">
              <input
                type="number"
                placeholder="Min"
                value={getParam(minKey)}
                onChange={(e) => setParam(minKey, e.target.value)}
                className="flex-1 min-w-0 p-1.5 sm:p-2 border border-gray-300 rounded-md text-xs sm:text-sm outline-none focus:border-primary transition-colors"
              />
              <span className="text-gray-500 text-xs sm:text-sm flex-shrink-0">—</span>
              <input
                type="number"
                placeholder="Max"
                value={getParam(maxKey)}
                onChange={(e) => setParam(maxKey, e.target.value)}
                className="flex-1 min-w-0 p-1.5 sm:p-2 border border-gray-300 rounded-md text-xs sm:text-sm outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>
        );
      }

      if (field.type === "text") {
        return (
          <div key={field.name}>
            <label className="block mb-2 font-medium text-gray-800 text-sm">
              {field.label}
            </label>
            <input
              type="text"
              placeholder={field.placeholder || field.label}
              value={
                field.name === "location" ? locationInput : getParam(field.name)
              }
              onChange={(e) =>
                field.name === "location"
                  ? setLocationInput(e.target.value)
                  : setParam(field.name, e.target.value)
              }
              className="w-full p-2 sm:p-2 border border-gray-300 rounded-md text-sm outline-none focus:border-primary transition-colors"
            />
          </div>
        );
      }

      if (field.type === "number") {
        return (
          <div key={field.name}>
            <label className="block mb-2 font-medium text-gray-800 text-sm">
              {field.label}
            </label>
            <input
              type="number"
              placeholder={field.placeholder || field.label}
              value={getParam(field.name)}
              onChange={(e) => setParam(field.name, e.target.value)}
              min={field.validation?.min}
              max={field.validation?.max}
              className="w-full p-2 sm:p-2 border border-gray-300 rounded-md text-sm outline-none focus:border-primary transition-colors"
            />
          </div>
        );
      }

      if (field.type === "boolean") {
        return (
          <div key={field.name}>
            <label className="flex items-center gap-1 sm:gap-2 text-gray-800 text-xs sm:text-sm font-medium">
              <input
                type="checkbox"
                checked={getParam(field.name) === "true"}
                onChange={(e) =>
                  setParam(field.name, e.target.checked ? "true" : "")
                }
                className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
              />
              {field.label}
            </label>
          </div>
        );
      }

      if (field.type === "date") {
        return (
          <div key={field.name}>
            <label className="block mb-2 font-medium text-gray-800 text-sm">
              {field.label}
            </label>
            <input
              type="date"
              value={getParam(field.name)}
              onChange={(e) => setParam(field.name, e.target.value)}
              className="w-full p-2 sm:p-2 border border-gray-300 rounded-md text-sm outline-none focus:border-primary transition-colors"
            />
          </div>
        );
      }

      if (field.type === "select") {
        return (
          <div key={field.name}>
            <label className="block mb-2 font-medium text-gray-800 text-sm">
              {field.label}
            </label>
            <select
              value={getParam(field.name)}
              onChange={(e) => setParam(field.name, e.target.value)}
              className="w-full p-2 sm:p-2 border border-gray-300 rounded-md text-sm bg-white outline-none focus:border-primary transition-colors"
            >
              <option value="">All</option>
              {field.options?.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        );
      }

      if (field.type === "multiselect") {
        const selectedValues = getParam(field.name)
          .split(",")
          .filter((v) => v);
        return (
          <div key={field.name}>
            <label className="block mb-2 font-medium text-gray-800 text-sm">
              {field.label}
            </label>
            <div className="space-y-1 sm:space-y-2 max-h-32 sm:max-h-40 lg:max-h-48 overflow-y-auto">
              {field.options?.map((opt) => (
                <label key={opt} className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                  <input
                    type="checkbox"
                    checked={selectedValues.includes(opt)}
                    onChange={(e) => {
                      const newValues = e.target.checked
                        ? [...selectedValues, opt]
                        : selectedValues.filter((v) => v !== opt);
                      setParam(field.name, newValues.join(","));
                    }}
                    className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>
        );
      }

      if (field.type === "measurement") {
        // const unit =
        //   getParam(`${field.name}_unit`) ||
        //   field.defaultUnit ||
        //   (field.supportedUnits?.[0] ?? "");
        const minKey = `${field.name}_min`;
        const maxKey = `${field.name}_max`;

        return (
          <div key={field.name}>
            <label className="block mb-1 sm:mb-2 font-medium text-gray-800 text-xs sm:text-sm">
              {field.label}
            </label>
            <div className="flex gap-1 sm:gap-2 items-center">
              <input
                type="number"
                placeholder="Min"
                value={getParam(minKey)}
                onChange={(e) => setParam(minKey, e.target.value)}
                className="flex-1 min-w-0 p-1.5 sm:p-2 border border-gray-300 rounded-md text-xs sm:text-sm outline-none focus:border-primary transition-colors"
              />
              <span className="text-gray-500 text-xs sm:text-sm flex-shrink-0">—</span>
              <input
                type="number"
                placeholder="Max"
                value={getParam(maxKey)}
                onChange={(e) => setParam(maxKey, e.target.value)}
                className="flex-1 min-w-0 p-1.5 sm:p-2 border border-gray-300 rounded-md text-xs sm:text-sm outline-none focus:border-primary transition-colors"
              />
              {/* {field.supportedUnits && field.supportedUnits.length > 0 && (
                <select
                  value={unit}
                  onChange={(e) =>
                    setParam(`${field.name}_unit`, e.target.value)
                  }
                  className="w-16 p-2 border border-gray-300 rounded-md text-sm bg-white outline-none focus:border-primary transition-colors"
                >
                  {field.supportedUnits.map((unitOpt) => (
                    <option key={unitOpt} value={unitOpt}>
                      {unitOpt}
                    </option>
                  ))}
                </select>
              )} */}
            </div>
          </div>
        );
      }

      return null;
    },
    [getParam, setParam, locationInput, setLocationInput]
  );

  // Default fields for when no subcategory is selected
  const defaultFields: FilterField[] = [
    {
      name: "price",
      label: "Price Range",
      type: "range",
      validation: { min: 0, max: 1000000 },
    },
    {
      name: "location",
      label: "Location",
      type: "text",
      placeholder: "Enter location",
    },
  ];

  // Determine which fields to show
  const fieldsToRender =
    loading || error || !selectedSubcategory || fields.length === 0
      ? defaultFields
      : fields
        .slice()
        .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));

  const containerWidth = "w-full";
  const containerPadding =
    fieldsToRender === defaultFields
      ? "p-2 sm:p-4 lg:p-5"
      : "p-3 sm:p-5 lg:p-8 mt-2";

  return (
    <div
      className={`filter-container ${containerWidth} ${containerPadding} h-fit mx-auto`}
    >
      {/* Mobile toggle */}
      <div className="flex md:hidden items-center justify-between mb-1 sm:mb-2">
        <span className="font-semibold text-sm sm:text-base text-gray-800">Filters</span>
        <button
          className="px-2 py-1 sm:px-3 sm:py-1 rounded bg-primary text-white text-xs sm:text-sm font-semibold shadow"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Hide" : "Show"}
        </button>
      </div>
      <div className={`flex-col gap-3 sm:gap-4 lg:gap-5 ${open ? 'flex' : 'hidden'} md:flex`}>
        <form className="flex flex-col gap-3 sm:gap-4 lg:gap-5">
          {fieldsToRender.map(renderField)}

          {fieldsToRender !== defaultFields && (
            <button
              type="button"
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString());
                fieldsToRender.forEach((f) => {
                  params.delete(f.name);
                  params.delete(`${f.name}_min`);
                  params.delete(`${f.name}_max`);
                  params.delete(`${f.name}_unit`);
                });
                router.push(`?${params.toString()}`);
              }}
              className="mt-1 sm:mt-2 py-2 sm:py-3 bg-primary text-white rounded-md text-xs sm:text-sm font-medium cursor-pointer transition-colors duration-200 hover:bg-primary"
            >
              Clear All Filters
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Filterings;
