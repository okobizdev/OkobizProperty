import { Router } from "express";
import UserMiddlewares from "../../modules/user/user.middlewares";
import VissionControllers from "../../modules/vission/vission.controllers";
import { UserRole } from "../../interfaces/jwtPayload.interfaces";
const { checkAccessToken, allowRole } = UserMiddlewares;
const {
  handleCreateVission,
  handleDeleteVission,
  handleRetrieveAllVission,
  handleUpdateVission,
} = VissionControllers;

const router = Router();

router
  .route("/admin/vission")
  .post(
    checkAccessToken,
    allowRole(UserRole.Admin, UserRole.ContentManager),
    handleCreateVission
  )
  .get(handleRetrieveAllVission);

router
  .route("/admin/vission/:id")
  .put(
    checkAccessToken,
    allowRole(UserRole.Admin, UserRole.ContentManager),
    handleUpdateVission
  )
  .delete(
    checkAccessToken,
    allowRole(UserRole.Admin, UserRole.ContentManager),
    handleDeleteVission
  );

export default router;
