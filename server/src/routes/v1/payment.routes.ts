import Router from "express";
import { getAllPayments } from "../../modules/payment/payment.controller";
import UserMiddlewares from "../../modules/user/user.middlewares";
import { UserRole } from "../../interfaces/jwtPayload.interfaces";

const { checkAccessToken, allowRole } = UserMiddlewares;

const router = Router();

router.get("/", checkAccessToken, allowRole(UserRole.Admin), getAllPayments);

export default router;
