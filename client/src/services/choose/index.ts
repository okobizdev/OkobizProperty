"use server";

import { apiBaseUrl } from "@/config/config";

export const getAllChoose = async () => {
  const res = await fetch(`${apiBaseUrl}/why-choose-us`, { cache: "no-store" });

  return res.json();
};


