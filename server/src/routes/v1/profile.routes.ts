import { Router } from "express";
import UserMiddlewares from "../../modules/user/user.middlewares";
import ProfileControllers from "../../modules/profile/profile.controllers";
import upload from "../../middlewares/multer.middleware";
import { UserRole } from "../../interfaces/jwtPayload.interfaces";

const router = Router();
const { checkAccessToken, allowRole } = UserMiddlewares;
const {
  handleCreateWorksAt,
  handleGetWorksAt,
  handleCreateLocation,
  handleGetLocation,
  handleUpdateLanguage,
  handleGetLanguage,
  handleUpdateBio,
  handleGetBio,
  handleUpdateAvatar,
  handleGetAvatar,
  handleIdentityUpload,
  handleGetAllUsers,
  handleChangeUserIdentityStatus,
  handleSearchUser,
  handleGetMyProfile,
  handleUpdatePhoneNumber
} = ProfileControllers;
router.route("/profile").get(checkAccessToken, handleGetMyProfile);
router.route("/profile/work").patch(checkAccessToken, handleCreateWorksAt);
router.route("/profile/work").get(checkAccessToken, handleGetWorksAt);
router.route("/profile/location").patch(checkAccessToken, handleCreateLocation);
router.route("/profile/location").get(checkAccessToken, handleGetLocation);
router.route("/profile/language").patch(checkAccessToken, handleUpdateLanguage);
router.route("/profile/language").get(checkAccessToken, handleGetLanguage);
router.route("/profile/bio").patch(checkAccessToken, handleUpdateBio);
router.route("/profile/bio").get(checkAccessToken, handleGetBio);
router
  .route("/profile/avatar")
  .patch(checkAccessToken, upload.single("avatar"), handleUpdateAvatar);

router.route("/profile/avatar").get(checkAccessToken, handleGetAvatar);
router
  .route("/profile/identity-document")
  .post(checkAccessToken, upload.array("documents"), handleIdentityUpload);

// ADMIN ROUTES
router
  .route("/admin/users")
  .get(
    checkAccessToken,
    allowRole(UserRole.Admin, UserRole.AccountAdministrator),
    handleGetAllUsers
  );
router
  .route("/admin/users/:id")
  .patch(
    checkAccessToken,
    allowRole(UserRole.Admin, UserRole.ListingVerificationManager),
    handleChangeUserIdentityStatus
  );
router
  .route("/admin/search/users/")
  .get(
    checkAccessToken,
    allowRole(UserRole.Admin, UserRole.ListingVerificationManager),
    handleSearchUser
  );

router
  .route("/profile/phone")
  .patch(checkAccessToken, handleUpdatePhoneNumber);

export default router;
