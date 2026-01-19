"use server";
import { apiBaseUrl } from "@/config/config";

export const getAllBanners = async () => {
  try {
    const res = await fetch(`${apiBaseUrl}/admin/banner`);

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}, Message: ${res.statusText}`);
    }

    return await res.json();
  } catch (error: any) {
    console.error("Error fetching banners:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });

    throw new Error("Failed to fetch banners. Please try again later.");
  }
};