import BlogApis from "../apis/blog.apis";

const {
  getBlogApi, addBlogApi, getBlogBySlugApi, editBlogApi, deleteBlogApi, editBlogFieldApi

} = BlogApis;

const BlogServices = {
  processGetBlogs: async (page, limit) => {
    try {
      const response = await getBlogApi(page, limit);
      return response?.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown error occurred in processGetBlogs");
      }
    }
  },

  processGetBlogBySlug: async (id) => {
    try {
      const response = await getBlogBySlugApi(id);
      return response?.data?.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown error occurred in processGetBlogById");
      }
    }
  },

  processAddBlog: async (payload) => {
    try {
      const response = await addBlogApi(payload);
      return response?.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown error occurred in processAddBlog");
      }
    }
  },

  processEditBlog: async (id, payload) => {
    try {
      const response = await editBlogApi(id, payload);
      return response?.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown error occurred in processEditBlog");
      }
    }
  },
  processEditBlogField: async (id, payload) => {
    try {

      const response = await editBlogFieldApi(id, payload);
      return response?.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown error occurred in processEditBlog");
      }
    }
  },
  processDeleteBlog: async (id) => {
    try {
      const response = await deleteBlogApi(id);
      return response?.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown error occurred in processDeleteBlog");
      }
    }
  },
};

export default BlogServices;
