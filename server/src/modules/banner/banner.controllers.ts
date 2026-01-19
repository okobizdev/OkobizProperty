import { NextFunction, Request, Response } from "express";
import logger from "../../configs/logger.configs";
import BannerServices from "./banner.services";
import mongoose from "mongoose";

const { processCreateBanner, processDeleteBanner, processRetrieveAllBanners } =
  BannerServices;

const BannerControllers = {
  handleCreateBanner: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const bannerImage = req?.file?.filename;
      const data = await processCreateBanner({ bannerImage });
      res.status(201).json({
        status: "success",
        message: "Banner created successfully",
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },

  handleRetrieveAllBanner: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const data = await processRetrieveAllBanners();
      res.status(200).json({
        status: "success",
        message: "Banner retrieve successful",
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },

  handleDeleteBanner: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ status: "error", message: "Invalid banner ID" });
        return;
      }

      const bannerId = new mongoose.Types.ObjectId(id);
      console.log("banner I", bannerId);
     const data =  await processDeleteBanner({ bannerId });
     console.log("darta", data );

      res.status(200).json({
        status: "success",
        message: "Banner deleted successfully",
        data
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
};

export default BannerControllers;
