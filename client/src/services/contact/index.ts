"use server";

import { apiBaseUrl } from "@/config/config";
import { ContactSubmitResponse } from "@/types/contactFormtypes";

export const contactSubmitFormApi = async (
  formData: FormData
): Promise<ContactSubmitResponse> => {
  const res = await fetch(`${apiBaseUrl}/create-contact`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to submit contact form");
  }

  return res.json();
};

export const companyContactInfo = async () => {
  const res = await fetch(`${apiBaseUrl}/contactinfo`, {
    method: "GET",
    cache: "no-store",
  });

  return res.json();
}