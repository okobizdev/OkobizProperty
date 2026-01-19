import { NextFunction, Request, Response } from "express";
import logger from "../../configs/logger.configs";
import TeamServices from "./team.services";
import mongoose from "mongoose";
import ITeam, { ITeamUpdateFieldPayload } from "./team.interfaces";

const {
  processCreateTeamMember,
  processDeleteTeamMember,
  processRetrieveAllTeamMembers,
  processUpdateTeamMember,
  processUpdateTeamField,
} = TeamServices;

const TeamControllers = {
  handleCreateTeamMember: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const teamMemberImage = req?.file?.filename;
      const { teamMemberName, teamMemberDesignation } = req.body;

      const data = await processCreateTeamMember({
        teamMemberName,
        teamMemberDesignation,
        teamMemberImage,
      });

      res.status(201).json({
        status: "success",
        message: "Team member created successfully",
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleUpdateOneTeamMember: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { id } = req.params;
    const { teamMemberImage } = req.teamMember as ITeam;
    const oldImage = teamMemberImage;
    const { teamMemberName, teamMemberDesignation } = req.body;

    const newImage = req?.file?.filename;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res
        .status(400)
        .json({ status: "error", message: "Invalid team member ID" });
      return;
    }
    const teamMemberId = new mongoose.Types.ObjectId(id);
    try {
      const data = await processUpdateTeamMember({
        teamMemberId,
        teamMemberOldImage: oldImage,
        teamMemberDesignation,
        teamMemberImage: newImage,
        teamMemberName,
      });
      res.status(200).json({
        status: "success",
        message: "Team member information updated successfully",
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleUpdateTeamField: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const updatedData = req.body;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ status: "error", message: "Invalid blog ID" });
        return;
      }
      const teamMemberId = new mongoose.Types.ObjectId(id);
      const payload = {
        teamMemberId,
        payload: updatedData,
      } as ITeamUpdateFieldPayload;

      const data = await processUpdateTeamField(payload);
      res.status(200).json({
        status: "success",
        message: "Team members retrieved successfully",
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleRetrieveAllTeamMembers: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const data = await processRetrieveAllTeamMembers();
      res.status(200).json({
        status: "success",
        message: "Team members retrieved successfully",
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },

  handleDeleteTeamMember: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const { teamMemberImage } = req.teamMember as ITeam;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res
          .status(400)
          .json({ status: "error", message: "Invalid team member ID" });
        return;
      }

      const teamMemberId = new mongoose.Types.ObjectId(id);

      await processDeleteTeamMember({ teamMemberId, teamMemberImage });

      res.status(200).json({
        status: "success",
        message: "Team member deleted successfully",
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
};

export default TeamControllers;
