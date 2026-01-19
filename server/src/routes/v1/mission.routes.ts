import { Router } from "express";
import UserMiddlewares from "../../modules/user/user.middlewares";
import MissionControllers from "../../modules/mission/mission.controllers";
import { UserRole } from "../../interfaces/jwtPayload.interfaces";
const { checkAccessToken, allowRole } = UserMiddlewares;
const {
  handleCreateMission,
  handleDeleteMission,
  handleRetrieveAllMission,
  handleUpdateMission,
} = MissionControllers;

const router = Router();

router
  .route("/admin/mission")
  .post(
    checkAccessToken,
    allowRole(UserRole.Admin, UserRole.ContentManager),
    handleCreateMission
  )
  .get(handleRetrieveAllMission);

router
  .route("/admin/mission/:id")
  .put(
    checkAccessToken,
    allowRole(UserRole.Admin, UserRole.ContentManager),
    handleUpdateMission
  )
  .delete(
    checkAccessToken,
    allowRole(UserRole.Admin, UserRole.ContentManager),
    handleDeleteMission
  );

export default router;
