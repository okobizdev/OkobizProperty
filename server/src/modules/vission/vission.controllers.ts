import { NextFunction, Request, Response } from "express";
import logger from "../../configs/logger.configs";
import mongoose from "mongoose";
import VissionServices from "./vission.services";
const {
  processCreateVission,
  processDeleteVission,
  processRetrieveAllVissions,
  processUpdateVission,
} = VissionServices;
const VissionControllers = {
  handleCreateVission: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const data = await processCreateVission(req.body);
      res.status(201).json({
        status: "success",
        message: "Vission create successful",
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleRetrieveAllVission: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const data = await processRetrieveAllVissions();
      res.status(200).json({
        status: "success",
        message: "Vission retrieve successful",
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleUpdateVission: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const { vissionDescription } = req.body;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ status: "error", message: "Invalid faq ID" });
        return;
      }
      const vissionId = new mongoose.Types.ObjectId(id);
      const data = await processUpdateVission({
        vissionId,
        vissionDescription,
      });
      res.status(200).json({
        status: "success",
        message: "Vission update successful",
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleDeleteVission: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ status: "error", message: "Invalid faq ID" });
        return;
      }
      const vissionId = new mongoose.Types.ObjectId(id);
      const data = await processDeleteVission({ vissionId });
      res.status(200).json({
        status: "success",
        message: "Vission delete successful",
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
};

export default VissionControllers;
