import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import WhyChooseUsRepositories from './whyChooseUs.repositories';
const { findOne } = WhyChooseUsRepositories;
const WhyChooseUsMiddlewares = {
  isWhyChooseUsExist: async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ status: 'error', message: 'Invalid whyChooseUs ID' });
      return;
    }
    const whyChooseUsId = new mongoose.Types.ObjectId(id);
    const isFound = await findOne({ whyChooseUsId });
    if (!isFound) {
      res.status(404).json({ status: 'error', message: 'Blog not found' });
      return;
    }
    req.whyChooseUs = isFound;
    next();
  },
};

export default WhyChooseUsMiddlewares;
