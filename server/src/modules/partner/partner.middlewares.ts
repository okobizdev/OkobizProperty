import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import PartnerRepositories from "./partner.repositories";

const { findOnePartner } = PartnerRepositories;

const PartnerMiddlewares = {
  isPartnerExist: async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ status: "error", message: "Invalid Partner ID" });
      return;
    }
    const partnerId = new mongoose.Types.ObjectId(id);
    const isFound = await findOnePartner({ partnerId });
    if (!isFound) {
      res.status(404).json({ status: "error", message: "Partner not found" });
      return;
    }
    req.partner = isFound;
    next();
  },
};

export default PartnerMiddlewares;
