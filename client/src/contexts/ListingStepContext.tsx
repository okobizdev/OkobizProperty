"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type ListingStepContextType = {
  setOnNextSubmit: (fn: () => Promise<void>) => void;
  onNextSubmit?: () => Promise<void>;
};

const ListingStepContext = createContext<ListingStepContextType | undefined>(
  undefined
);

export const useListingStepContext = () => {
  const context = useContext(ListingStepContext);
  if (!context) {
    throw new Error(
      "useListingStepContext must be used within a ListingStepProvider"
    );
  }
  return context;
};

export const ListingStepProvider = ({ children }: { children: ReactNode }) => {
  const [onNextSubmit, setOnNextSubmitState] = useState<() => Promise<void>>();

  const setOnNextSubmit = (fn: () => Promise<void>) => {
    setOnNextSubmitState(() => fn);
  };

  return (
    <ListingStepContext.Provider value={{ onNextSubmit, setOnNextSubmit }}>
      {children}
    </ListingStepContext.Provider>
  );
};
