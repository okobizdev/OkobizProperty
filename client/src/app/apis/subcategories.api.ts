import axiosClient from "@/lib/axios.config";
import { Subcategory } from "@/types/subcategories";

// Get all subcategories
export async function getSubcategories(): Promise<Subcategory[]> {
  const res = await axiosClient.get<Subcategory[]>("/subcategories");
  return res.data;
}

// Get a single subcategory by ID
export async function getSubcategory(id: string): Promise<Subcategory> {
  const res = await axiosClient.get<Subcategory>(`/subcategories/${id}`);
  return res.data;
}

// Create a new subcategory
export async function createSubcategory(data: FormData): Promise<Subcategory> {
  const res = await axiosClient.post<Subcategory>("/subcategories", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

// Update a subcategory
export async function updateSubcategory(
  id: string,
  data: FormData
): Promise<Subcategory> {
  const res = await axiosClient.put<Subcategory>(`/subcategories/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

// Delete a subcategory
export async function deleteSubcategory(
  id: string
): Promise<{ message: string }> {
  const res = await axiosClient.delete<{ message: string }>(
    `/subcategories/${id}`
  );
  return res.data;
}

// Hook for fetching subcategories
import { useEffect, useState } from "react";

export function useSubcategories() {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getSubcategories()
      .then((data) => {
        setSubcategories(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { subcategories, loading, error };
}
