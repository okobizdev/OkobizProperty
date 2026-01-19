import { getAllBlog } from "@/services/blog";

export const fetchBlogsService = async (page: number, pageSize: number) => {
    try {
        const response = await getAllBlog(page, pageSize);

        if (response.status === "success") {
            return {
                blogs: response.data || [],
                total: response.totalBlogs || 0,
                currentPage: response.currentPage || page,
            };
        }

        return { blogs: [], total: 0, currentPage: page };
    } catch (error) {
        console.error("Error fetching blogs:", error);
        throw new Error("Failed to fetch blogs");
    }
};