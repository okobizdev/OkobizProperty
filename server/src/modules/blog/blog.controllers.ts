import { NextFunction, Request, Response } from 'express';
import logger from '../../configs/logger.configs';
import BlogServices from './blog.services';
import IBlogInterfces, { IBlogPayload, IBLogQuery, IBlogUpdateField } from './blog.interfaces';
import mongoose from 'mongoose';
const {
  processCreateBlog,
  processUpdateBlog,
  processDeleteBlog,
  processRetrieveBlog,
  processRetrieveSingleBlog,
  processUpdateBlogField,
} = BlogServices;
const BlogControllers = {
  handleRetrieveSingleBlog: async (req: Request, res: Response, next: NextFunction) => {
    const { slug } = req.params;

    try {
      const data = await processRetrieveSingleBlog({ slug });
      res.status(200).json({
        status: 'success',
        message: 'blog retrieve successful',
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleRetrieveBlog: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const { data, total } = await processRetrieveBlog({ page, limit });
      const totalPages = Math.ceil(total / limit);
      res.status(200).json({
        status: 'success',
        message: 'blog retrieve successful',
        totalBlogs: total,
        totalPages,
        currentPage: page,
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleCreateBlog: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { blogTitle, blogDescription, tags, blogVideo } = req.body as IBlogPayload;
      console.log(tags);
      const blogImage = req?.file?.filename;
      const data = await processCreateBlog({
        blogImage,
        blogDescription,
        blogTitle,
        tags,
        blogVideo
      });
      res.status(201).json({
        status: 'success',
        message: 'blog create successful',
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleUpdateBlog: async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { blogImage } = req.blog as IBlogPayload;
    const oldImage = blogImage;
    const { blogDescription, blogTitle, tags, } = req.body as IBlogPayload;

    const newImage = req?.file?.filename;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ status: 'error', message: 'Invalid blog ID' });
      return;
    }
    const blogId = new mongoose.Types.ObjectId(id);
    try {
      const data = await processUpdateBlog({
        blogImage: newImage,
        blogOldImage: oldImage,
        blogDescription,
        blogTitle,
        tags,
        blogId,
      });
      res.status(200).json({
        status: 'success',
        message: 'blog update successful',
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleBlogDelete: async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { blogImage } = req.blog as IBlogPayload;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ status: 'error', message: 'Invalid blog ID' });
      return;
    }
    const blogId = new mongoose.Types.ObjectId(id);
    try {
      await processDeleteBlog({ blogId, blogImage });
      res.status(200).json({
        status: 'success',
        message: 'blog delete successful',
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleUpdateBlogField: async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const field = req.body as IBlogInterfces;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ status: 'error', message: 'Invalid blog ID' });
      return;
    }
    const blogId = new mongoose.Types.ObjectId(id);
    const payload = { blogId } as IBlogUpdateField;
    payload.field = field;

    try {
      const data = await processUpdateBlogField(payload);
      res.status(200).json({
        status: 'success',
        message: 'blog field successful',
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
};
export default BlogControllers;
