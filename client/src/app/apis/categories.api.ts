import axiosClient from "@/lib/axios.config";

export interface Category {
  _id: string;
  name: string;
  description?: string;
  isActive?: boolean;
  displayOrder?: number;
  image?: string;
}

// Get all categories
export async function getCategories(): Promise<Category[]> {
  const res = await axiosClient.get<Category[]>("/categories");
  return res.data;
}

// Get a single category by ID
export async function getCategory(id: string): Promise<Category> {
  const res = await axiosClient.get<Category>(`/categories/${id}`);
  return res.data;
}

// Create a new category
export async function createCategory(data: FormData): Promise<Category> {
  const res = await axiosClient.post<Category>("/categories", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

// Update a category
export async function updateCategory(
  id: string,
  data: FormData
): Promise<Category> {
  const res = await axiosClient.put<Category>(`/categories/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

// Delete a category
export async function deleteCategory(id: string): Promise<{ message: string }> {
  const res = await axiosClient.delete<{ message: string }>(
    `/categories/${id}`
  );
  return res.data;
}
