import { NextFunction, Request, Response } from 'express';
import logger from '../../configs/logger.configs';
import mongoose from 'mongoose';
import WhyChooseUsServices from './whyChooseUs.services';
import { IWhyChooseUsPayload } from './whyChooseUs.interfaces';

const {
  processCreateWhyChooseUs,
  processDeleteWhyChooseUs,
  processRetrieveAllWhyChooseUs,
  processUpdateWhyChooseUs,
  processUpdateWhyChooseUsField,
} = WhyChooseUsServices;

const WhyChooseUsControllers = {
  handleCreateWhyChooseUs: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { whyChooseUsTitle, whyChooseUsDescription } = req.body as IWhyChooseUsPayload;
      const payload: IWhyChooseUsPayload = { whyChooseUsTitle, whyChooseUsDescription };
      const whyChooseUsIcon = req?.file?.filename;
      payload.whyChooseUsIcon = whyChooseUsIcon;
      const data = await processCreateWhyChooseUs(payload);
      res.status(201).json({
        status: 'success',
        message: 'WhyChooseUs created successfully',
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },

  handleRetrieveAllWhyChooseUs: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await processRetrieveAllWhyChooseUs();
      res.status(200).json({
        status: 'success',
        message: 'WhyChooseUs retrieved successfully',
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },

  handleUpdateWhyChooseUs: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { whyChooseUsTitle, whyChooseUsDescription } = req.body;
      const { whyChooseUsIcon } = req.whyChooseUs as IWhyChooseUsPayload;
      const whyChooseUsOldIcon = whyChooseUsIcon;
      const newImage = req?.file?.filename;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ status: 'error', message: 'Invalid WhyChooseUs ID' });
        return;
      }
      const whyChooseUsId = new mongoose.Types.ObjectId(id);
      const data = await processUpdateWhyChooseUs({
        whyChooseUsId,
        whyChooseUsTitle,
        whyChooseUsDescription,
        whyChooseUsIcon: newImage,
        whyChooseUsOldIcon,
      });
      res.status(200).json({
        status: 'success',
        message: 'WhyChooseUs updated successfully',
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleUpdateWhyChooseUsField: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { whyChooseUsTitle, whyChooseUsDescription } = req.body;
      if (!mongoose.Types.ObjectId.isValid(id) && !id) {
        res.status(400).json({ status: 'error', message: 'Invalid WhyChooseUs ID' });
        return;
      }
      const whyChooseUsId = new mongoose.Types.ObjectId(id);
      const data = await processUpdateWhyChooseUsField({
        whyChooseUsDescription,
        whyChooseUsTitle,
        whyChooseUsId,
      });
      res.status(200).json({
        status: 'success',
        message: 'WhyChooseUs field updated successfully',
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleDeleteWhyChooseUs: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { whyChooseUsIcon } = req.whyChooseUs as IWhyChooseUsPayload;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ status: 'error', message: 'Invalid WhyChooseUs ID' });
        return;
      }
      const whyChooseUsId = new mongoose.Types.ObjectId(id);
      await processDeleteWhyChooseUs({ whyChooseUsId, whyChooseUsIcon });

      res.status(200).json({
        status: 'success',
        message: 'WhyChooseUs deleted successfully',
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
};

export default WhyChooseUsControllers;
