import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import TeamRepositories from "./team.repositories";
const { findOneTeamMember } = TeamRepositories;
const TeamMiddlewares = {
  isTeamMemberExist: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res
        .status(400)
        .json({ status: "error", message: "Invalid team member ID" });
      return;
    }
    const teamMemberId = new mongoose.Types.ObjectId(id);
    const isFound = await findOneTeamMember({ teamMemberId });
    if (!isFound) {
      res
        .status(404)
        .json({ status: "error", message: "Team member not found" });
      return;
    }
    req.teamMember = isFound;
    next();
  },
};

export default TeamMiddlewares;
