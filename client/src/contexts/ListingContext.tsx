"use client";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type ListingContextType = {
  listingId: string | null;
  featureType: "rent" | "flat" | "land" | null;
  featureId: string | null;
  setListingId: (id: string) => void;
  setFeatureType: (type: "rent" | "flat" | "land") => void;
  setFeatureId: (id: string) => void;
};

const ListingContext = createContext<ListingContextType | undefined>(undefined);

export const useListingContext = () => {
  const context = useContext(ListingContext);
  if (!context) {
    throw new Error("useListingContext must be used within a ListingProvider");
  }
  return context;
};

export const ListingProvider = ({ children }: { children: ReactNode }) => {
  const [listingId, setListingIdState] = useState<string | null>(null);
  const [featureType, setFeatureTypeState] = useState<
    "rent" | "flat" | "land" | null
  >(null);
  const [featureId, setFeatureIdState] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const storedListingId = localStorage.getItem("listingId");
    const storedFeatureId = localStorage.getItem("featureId");
    const storedFeatureType = localStorage.getItem("featureType");
    if (storedListingId) setListingIdState(storedListingId);
    if (storedFeatureId) setFeatureIdState(storedFeatureId);
    if (
      storedFeatureType &&
      ["rent", "flat", "land"].includes(storedFeatureType)
    ) {
      setFeatureTypeState(storedFeatureType as "rent" | "flat" | "land");
    }
  }, []);

  // Update localStorage when values change
  useEffect(() => {
    if (listingId) {
      localStorage.setItem("listingId", listingId);
    }
  }, [listingId]);

  useEffect(() => {
    if (featureId) {
      localStorage.setItem("featureId", featureId);
    }
  }, [featureId]);

  useEffect(() => {
    if (featureType) {
      localStorage.setItem("featureType", featureType);
    }
  }, [featureType]);

  // Wrapped setters to keep state and localStorage in sync
  const setListingId = (id: string) => {
    setListingIdState(id);
    localStorage.setItem("listingId", id);
  };
  const setFeatureId = (id: string) => {
    setFeatureIdState(id);
    localStorage.setItem("featureId", id);
  };
  const setFeatureType = (type: "rent" | "flat" | "land") => {
    setFeatureTypeState(type);
    localStorage.setItem("featureType", type);
  };

  return (
    <ListingContext.Provider
      value={{
        listingId,
        featureType,
        featureId,
        setListingId,
        setFeatureType,
        setFeatureId,
      }}
    >
      {children}
    </ListingContext.Provider>
  );
};
