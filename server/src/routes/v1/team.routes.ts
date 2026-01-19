import { Router } from "express";
import UserMiddlewares from "../../modules/user/user.middlewares";
import upload from "../../middlewares/multer.middleware";
import TeamControllers from "../../modules/team/team.controllers";
import TeamMiddlewares from "../../modules/team/team.middlewares";
import { UserRole } from "../../interfaces/jwtPayload.interfaces";

const { checkAccessToken, allowRole } = UserMiddlewares;
const { isTeamMemberExist } = TeamMiddlewares;
const {
  handleCreateTeamMember,
  handleDeleteTeamMember,
  handleRetrieveAllTeamMembers,
  handleUpdateOneTeamMember,
  handleUpdateTeamField,
} = TeamControllers;

const router = Router();

router
  .route("/admin/team")
  .post(
    checkAccessToken,
    allowRole(UserRole.Admin, UserRole.ContentManager),
    upload.single("teamMemberImage"),
    handleCreateTeamMember
  )
  .get(handleRetrieveAllTeamMembers);

router
  .route("/admin/team/:id")
  .patch(
    checkAccessToken,
    allowRole(UserRole.Admin, UserRole.ContentManager),
    handleUpdateTeamField
  )
  .put(
    checkAccessToken,
    allowRole(UserRole.Admin, UserRole.ContentManager),
    isTeamMemberExist,
    upload.single("teamMemberImage"),
    handleUpdateOneTeamMember
  )
  .delete(
    checkAccessToken,
    allowRole(UserRole.Admin, UserRole.ContentManager),
    isTeamMemberExist,
    handleDeleteTeamMember
  );

export default router;
