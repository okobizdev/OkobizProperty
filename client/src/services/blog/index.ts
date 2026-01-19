

interface BlogData {
    _id: string;
    blogTitle: string;
    blogImage: string;
    blogDescription: string;
    tags: string[];
    createdAt: string;
    updatedAt: string;
    slug: string;
    __v: number;
}

interface ApiResponse {
    status: string;
    message: string;
    data: BlogData;
}


import { apiBaseUrl } from "@/config/config";

export const getAllBlog = async (page = 1, limit = 8) => {
    try {
        const res = await fetch(`${apiBaseUrl}/blog?page=${page}&limit=${limit}`, {
            method: "GET",
        });

        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}, Message: ${res.statusText}`);
        }

        return await res.json();
    } catch (error: any) {
        if (error.code === 'ECONNREFUSED') {
            console.error('Connection refused. Please check if the server is running and accessible.');
        } else {
            console.error('Error fetching blogs:', {
                message: error.message,
                stack: error.stack,
                name: error.name,
            });
        }

        throw new Error("Failed to fetch blogs. Please try again later.");
    }
};
export const getBlogBySlug = async (slug: string): Promise<ApiResponse> => {
    try {
        const res = await fetch(`${apiBaseUrl}/blog/${slug}`, {
            method: "GET",

        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        return res.json();
    } catch (error) {
        console.error('Error fetching blog by slug:', error);
        throw error;
    }
};
