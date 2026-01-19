import { NextFunction, Request, Response } from "express";
import logger from "../../configs/logger.configs";
import MissionServices from "./mission.services";
import mongoose from "mongoose";

const {
  processCreateMission,
  processDeleteMission,
  processRetrieveAllMissions,
  processUpdateMission,
} = MissionServices;

const MissionControllers = {
  handleCreateMission: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const data = await processCreateMission(req.body);
      res.status(201).json({
        status: "success",
        message: "Mission create successful",
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleRetrieveAllMission: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const data = await processRetrieveAllMissions();
      res.status(200).json({
        status: "success",
        message: "Mission retrieve successful",
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleUpdateMission: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const { missionDescription } = req.body;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ status: "error", message: "Invalid faq ID" });
        return;
      }
      const missionId = new mongoose.Types.ObjectId(id);
      const data = await processUpdateMission({
        missionId,
        missionDescription,
      });
      res.status(200).json({
        status: "success",
        message: "Mission update successful",
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleDeleteMission: async (
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
      const missionId = new mongoose.Types.ObjectId(id);
      const data = await processDeleteMission({ missionId });
      res.status(200).json({
        status: "success",
        message: "Mission delete successful",
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
};

export default MissionControllers;
