import { NextFunction, Request, Response } from "express";
import logger from "../../configs/logger.configs";
import PartnerServices from "./partner.services";
import mongoose from "mongoose";
import IPartner from "./partner.interfaces";

const {
  processCreatePartner,
  processDeletePartner,
  processRetrieveAllPartners,
  processUpdatePartner,
} = PartnerServices;

const PartnerControllers = {
  handleCreatePartner: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const partnerImage = req?.file?.filename;
      const data = await processCreatePartner({ partnerImage });
      res.status(201).json({
        status: "success",
        message: "Partner created successfully",
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },

  handleRetrieveAllPartner: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const data = await processRetrieveAllPartners();
      res.status(200).json({
        status: "success",
        message: "Partner retrieve successful",
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },

  handleUpdatePartner: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;

      const partnerImage = req?.file?.filename;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res
          .status(400)
          .json({ status: "error", message: "Invalid partner ID" });
        return;
      }

      const partnerId = new mongoose.Types.ObjectId(id);

      const data = await processUpdatePartner({
        partnerId,
        partnerImage,
      });

      res.status(200).json({
        status: "success",
        message: "Partner updated successfully",
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },

  handleDeletePartner: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const { partnerImage } = req.partner as IPartner;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res
          .status(400)
          .json({ status: "error", message: "Invalid partner ID" });
        return;
      }

      const partnerId = new mongoose.Types.ObjectId(id);
      await processDeletePartner({ partnerId, partnerImage });

      res.status(200).json({
        status: "success",
        message: "Partner deleted successfully",
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
};

export default PartnerControllers;
