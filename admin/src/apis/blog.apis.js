import axiosClient from "../configs/axios.config";



const BlogApi = {
    getBlogApi: (page = 1, limit = 10) => {
        return axiosClient.get(`/blog?page=${page}&limit=${limit}`);
    },
    getBlogBySlugApi: (slug) => {
        return axiosClient.get(`/blog/${slug}`);
    },
    addBlogApi: (payload) => {
        return axiosClient.post("/blog", payload);
    },
    editBlogApi: (id, payload) => {
        return axiosClient.put(`/blog/${id}`, payload);
    },
    deleteBlogApi: (id) => {
        return axiosClient.delete(`/blog/${id}`);
    },
    editBlogFieldApi: (id, payload) => {
        return axiosClient.patch(`/blog/${id}`, payload);
    },
};

export default BlogApi;