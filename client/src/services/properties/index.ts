import axiosClient from "@/lib/axios.config";
import { Property } from "@/types/propertyTypes";

export interface PropertiesResponse {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  properties: Property[];
}

export async function getProperties(
  params?: Record<string, any>
): Promise<PropertiesResponse> {
  const searchParams = new URLSearchParams(params).toString();
  const res = await axiosClient.get<PropertiesResponse>(
    `/properties${searchParams ? `?${searchParams}` : ""}`
  );
  return res.data;
}
export async function getPropertyById(id: string): Promise<Property> {
  const res = await axiosClient.get<Property>(`/properties/${id}`);
  return res.data;
}
export async function getPropertyBySlug(slug: string): Promise<Property> {
  const res = await axiosClient.get<Property>(`/properties/slug/${slug}`);
  return res.data;
}

// const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

// export const PropertyService = {
//   async getProperties(): Promise<Property[]> {
//     const res = await fetch(`${apiBaseUrl}/properties`);
//     if (!res.ok) throw new Error("Failed to fetch properties");
//     return res.json();
//   },

//   async createProperty(formData: FormData): Promise<Property> {
//     const res = await fetch(`${apiBaseUrl}/properties`, {
//       method: "POST",
//       body: formData,
//     });
//     if (!res.ok) throw new Error("Failed to create property");
//     return res.json();
//   },

//   async updateProperty(id: string, formData: FormData): Promise<Property> {
//     const res = await fetch(`${apiBaseUrl}/properties/${id}`, {
//       method: "PUT",
//       body: formData,
//     });
//     if (!res.ok) throw new Error("Failed to update property");
//     return res.json();
//   },

//   async deleteProperty(id: string): Promise<{ success: boolean }> {
//     const res = await fetch(`${apiBaseUrl}/properties/${id}`, {
//       method: "DELETE",
//     });
//     if (!res.ok) throw new Error("Failed to delete property");
//     return res.json();
//   },
// };
