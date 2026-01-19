import path, { join } from "path";
import {
  IBlogPayload,
  IBlogUpdateField,
} from "./blog.interfaces";
import BlogRepositories from "./blog.repositories";
import SlugUtils from "../../utils/slug.utils";

const { generateSlug } = SlugUtils;
const {
  createBlog,
  updateOneBlog,
  deletOneBlog,
  findAllBlogs,
  findOneBlog,
  updateOneField,
} = BlogRepositories;
import { promises as fs } from "fs";

const BlogServices = {
  processRetrieveBlog: async ({ page, limit }: IBlogPayload) => {
    try {
      return await findAllBlogs({ page, limit });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Error Occurred In blog retrieve service");
      }
    }
  },
  processRetrieveSingleBlog: async ({ slug }: IBlogPayload) => {
    try {
      return await findOneBlog({ slug });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(
          "Unknown Error Occurred In single blog retrieve service"
        );
      }
    }
  },
  processUpdateBlogField: async ({ field, blogId }: IBlogUpdateField) => {
    try {
      const { blogTitle } = field;
      if (blogTitle) field.slug = generateSlug(blogTitle);
      return await updateOneField({ field, blogId });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Error Occurred In blog field update service");
      }
    }
  },
  processCreateBlog: async ({
    blogDescription,
    blogTitle,
    blogImage,
    blogVideo,
    tags,
  }: IBlogPayload) => {
    const filePath = join(
      __dirname,
      "../../../public",
      blogImage as string
    ) as string;
    try {
      const data = await createBlog({
        blogDescription,
        blogTitle,
        blogImage: `/public/${blogImage}`,
        blogVideo,
        tags,
      });
      if (!data) {
        try {
          await fs.unlink(filePath);
          throw new Error("Image Uploading Failed");
        } catch (error) {
          throw error;
        }
      }
      return data;
    } catch (error) {
      if (error instanceof Error) {
        await fs.unlink(filePath);
        throw error;
      } else {
        await fs.unlink(filePath);
        throw new Error("Unknown Error Occurred In create blog service");
      }
    }
  },
  processUpdateBlog: async ({
    blogDescription,
    blogTitle,
    blogImage,
    blogVideo,
    tags,
    blogOldImage,
    blogId,
  }: IBlogPayload) => {
    const image = blogOldImage as string;
    const relativeImagePath = path.basename(image);
    const oldFilePath = join(__dirname, "../../../public", relativeImagePath);
    const newImageFilePath = join(
      __dirname,
      "../../../public",
      blogImage as string
    );
    const slug = generateSlug(blogTitle as string);
    try {
      const updatedData = await updateOneBlog({
        slug,
        blogDescription,
        blogTitle,
        tags,
        blogId,
        blogImage: `/public/${blogImage}`,
        blogVideo,
      });
      if (!updatedData) {
        fs.unlink(newImageFilePath);
      }
      fs.unlink(oldFilePath);
      return updatedData;
    } catch (error) {
      if (error instanceof Error) {
        await fs.unlink(newImageFilePath);
        throw error;
      } else {
        await fs.unlink(newImageFilePath);
        throw new Error("Unknown Error Occurred In update blog service");
      }
    }
  },
  processDeleteBlog: async ({ blogId, blogImage }: IBlogPayload) => {
     try {
    if (blogImage) {
      const image = blogImage as string;
      const relativeImagePath = image.replace("/public/", "");
      const filePath = join(__dirname, "../../../public", relativeImagePath);

      try {
        await fs.unlink(filePath);
      } catch (error: any) {
        // Ignore "file not found" errors but throw others
        if (error.code !== "ENOENT") {
          throw error;
        }
        console.warn(`Image not found at ${filePath}, skipping delete.`);
      }
    }

    // Proceed with deleting blog from DB regardless of image result
    await deletOneBlog({ blogId });
  } catch (error) {
    console.error("Error deleting blog:", error);
    throw new Error("Failed to delete blog");
  }
  },
};
export default BlogServices;
