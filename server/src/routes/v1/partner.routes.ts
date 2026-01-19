import { Router } from "express";
import UserMiddlewares from "../../modules/user/user.middlewares";
import PartnerControllers from "../../modules/partner/partner.controllers";
import upload from "../../middlewares/multer.middleware";
import PartnerMiddlewares from "../../modules/partner/partner.middlewares";
import { UserRole } from "../../interfaces/jwtPayload.interfaces";

const { checkAccessToken, allowRole } = UserMiddlewares;
const {
  handleCreatePartner,
  handleDeletePartner,
  handleRetrieveAllPartner,
  handleUpdatePartner,
} = PartnerControllers;

const { isPartnerExist } = PartnerMiddlewares;

const router = Router();

router
  .route("/admin/partner")
  .post(
    checkAccessToken,
    allowRole(UserRole.Admin, UserRole.ContentManager),
    upload.single("partnerImage"),
    handleCreatePartner
  )
  .get(handleRetrieveAllPartner);

router
  .route("/admin/partner/:id")
  .put(
    checkAccessToken,
    allowRole(UserRole.Admin, UserRole.ContentManager),
    upload.single("partnerImage"),
    handleUpdatePartner
  )
  .delete(
    checkAccessToken,
    allowRole(UserRole.Admin, UserRole.ContentManager),
    isPartnerExist,
    handleDeletePartner
  );

export default router;
