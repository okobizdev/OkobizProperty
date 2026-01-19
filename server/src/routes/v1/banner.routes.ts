import { Router } from "express";
import UserMiddlewares from "../../modules/user/user.middlewares";
import upload from "../../middlewares/multer.middleware";
import BannerControllers from "../../modules/banner/banner.controllers";
import { UserRole } from "../../interfaces/jwtPayload.interfaces";

const { checkAccessToken, allowRole } = UserMiddlewares;
const { handleCreateBanner, handleDeleteBanner, handleRetrieveAllBanner } =
  BannerControllers;

const router = Router();

router
  .route("/admin/banner")
  .post(
    checkAccessToken,
    allowRole(UserRole.Admin,UserRole.ContentManager),
    upload.single("bannerImage"),
    handleCreateBanner
  )
  .get( handleRetrieveAllBanner);

router
  .route("/admin/banner/:id")
  .delete(checkAccessToken, allowRole(UserRole.Admin,UserRole.ContentManager), handleDeleteBanner);

export default router;
