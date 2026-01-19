import { Router } from "express";
import UserMiddlewares from "../../modules/user/user.middlewares";
import UserControllers from "../../modules/user/user.controllers";

const router = Router();

const {
  signupInputValidation,
  isSignupUserExist,
  isUserExistAndVerified,
  isUserExist,
  checkVerificationOtp,
  checkAccessToken,
  checkRefreshToken,
  checkPassword,
  checkRole,
  isAdmin,
} = UserMiddlewares;
const {
  handleSignup,
  handleVerify,
  handleLogin,
  handleCheck,
  handleRefreshTokens,
  handleLogout,
  handleDeleteUser,
  handleResend,
  handleChangeStaffPassword,
  handleChangeStaffRole,
  handleCreateStaff,
  handleDeleteStaff,
  handleFindAllStaff,
  handleChangeOwnPassword,
  handleForgotPassword,
  handleResetPassword,
  handleResendForgotPasswordOtp,
  handleSendOTP
} = UserControllers;

router
  .route("/signup")
  .post(signupInputValidation, isSignupUserExist, handleSignup);
router.route("/verify").post(checkVerificationOtp, handleVerify);
router.route("/resend").post(isUserExist, handleResend);
router.route("/login").post(isUserExist, checkPassword, isUserExistAndVerified, handleLogin);
router
  .route("/admin/login")
  .post(isUserExist, checkPassword, isUserExistAndVerified, checkRole, handleSendOTP);
router.route("/admin/two-factor-auth").post(isUserExistAndVerified, checkVerificationOtp, handleLogin);
router.route("/refresh").post(checkRefreshToken, handleRefreshTokens);
router.route("/check").post(checkAccessToken, handleCheck);
router.route("/logout").post(checkAccessToken, handleLogout);
router
  .route("/admin/users/:id")
  .delete(checkAccessToken, isAdmin, handleDeleteUser);

router
  .route("/admin/create-staff")
  .post(checkAccessToken, isAdmin, isSignupUserExist, handleCreateStaff);
router.route("/admin/staff").get(checkAccessToken, isAdmin, handleFindAllStaff);
router
  .route("/admin/staff/:id")
  .delete(checkAccessToken, isAdmin, handleDeleteStaff);
router
  .route("/admin/staff/password/:id")
  .patch(checkAccessToken, isAdmin, handleChangeStaffPassword);

router
  .route("/admin/staff/role/:id")
  .patch(checkAccessToken, isAdmin, handleChangeStaffRole);
router.route("/user/change-password")
.patch(checkAccessToken, handleChangeOwnPassword);
router.route("/forgot-password").post( handleForgotPassword);
router.route("/reset-password").post(handleResetPassword);
router.route("/resend-forgot-password").post(handleResendForgotPasswordOtp);

export default router;
