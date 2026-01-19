import express from "express";
import { upsertAboutUs, getAboutUs } from "./aboutUs.controller";
import { upload } from "../../middlewares/aboutUsMiddleware";

const router = express.Router();

router.post(
  "/",
  upload.any(),
  upsertAboutUs
);

router.get("/", getAboutUs);

export default router;
