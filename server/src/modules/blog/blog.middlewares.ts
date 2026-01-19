import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import BlogRepositories from './blog.repositories';

const { findOneBlogById } = BlogRepositories;
const BlogMiddlewares = {
  isBlogExist: async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ status: 'error', message: 'Invalid blog ID' });
      return;
    }
    const blogId = new mongoose.Types.ObjectId(id);
    const isFound = await findOneBlogById({ blogId });
    if (!isFound) {
      res.status(404).json({ status: 'error', message: 'Blog not found' });
      return;
    }
    req.blog = isFound;
    next();
  },
};
export default BlogMiddlewares;
