import { IBlogPayload, IBLogQuery, IBlogUpdateField } from './blog.interfaces';
import Blog from './blog.models';

const BlogRepositories = {
  createBlog: async (payload: IBlogPayload) => {
    try {
      const newBlog = new Blog(payload);
      await newBlog.save();
      return newBlog;
    } catch (error) {
      throw new Error('Unknown Error Occurred In Blog Creation Operation');
    }
  },
  findAllBlogs: async ({ page, limit }: IBlogPayload) => {
    try {
      const query: IBLogQuery = {};
      const PerPage = limit ?? 10;
      const currentPage = page ?? 1;
      const skip = (currentPage - 1) * (limit ?? PerPage);
      const [data, total] = await Promise.all([
        Blog.find(query)
          .skip(skip)
          .sort({ createdAt: -1 })
          .limit(PerPage),
        Blog.countDocuments(query),
      ]);
      return { data, total };

    } catch (error) {
      throw new Error('Unknown Error Occurred In Blog Retrieve Operation');
    }
  },
  updateOneField: async ({ field, blogId }: IBlogUpdateField) => {
    try {
      const updatedData = await Blog.findByIdAndUpdate(blogId, field, {
        new: true,
      });
      return updatedData;
    } catch (error) {
      throw new Error('Unknown Error Occurred In Blog Field Update Operation');
    }
  },
  updateOneBlog: async ({
    blogDescription,
    blogId,
    blogImage,
    blogVideo,
    blogTitle,
    tags,
    slug,
  }: IBlogPayload) => {
    try {
      const updatedData = await Blog.findByIdAndUpdate(
        blogId,
        {
          $set: { slug, blogDescription, blogImage, blogVideo, blogTitle, tags },
        },
        { new: true }
      );
      return updatedData;
    } catch (error) {
      throw new Error('Unknown Error Occurred In Blog Update Operation');
    }
  },
  deletOneBlog: async ({ blogId }: IBlogPayload) => {
    try {
      const data = await Blog.findByIdAndDelete(blogId);
      if (!data) throw new Error('Team Member delete failed');
      return;
    } catch (error) {
      throw new Error('Unknown Error Occurred In Blog Update Operation');
    }
  },
  findOneBlog: async ({ slug }: IBlogPayload) => {
    try {
      const data = await Blog.findOne({ slug });
      return data;
    } catch (error) {
      throw new Error('Unknown Error Occurred In Single Blog Retrieve Operation');
    }
  },
  findOneBlogById: async ({ blogId }: IBlogPayload) => {
    try {
      const data = await Blog.findOne({ _id: blogId });
      return data;
    } catch (error) {
      throw new Error('Unknown Error Occurred In Single Blog Retrieve Operation');
    }
  },
};
export default BlogRepositories;
