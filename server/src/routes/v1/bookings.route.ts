// import { Router } from "express";
// import {
//     getAllBookings,
//     getBookingById,
//     createBooking,
//     deleteBooking,
//     getBookingByPropertyId,
//     getBookingByHostId,
//     getBookingByUserId,
//     updateBookingStatus
// } from "../../modules/bookings/bookings.controller";
// import UserMiddlewares from "../../modules/user/user.middlewares";
// import { UserRole } from "../../interfaces/jwtPayload.interfaces";


// const router = Router();
// const { checkAccessToken, allowRole } = UserMiddlewares;

// router.get("/", checkAccessToken, allowRole(UserRole.Admin), getAllBookings);
// router.get("/:id", getBookingById);
// router.post("/", checkAccessToken, allowRole(UserRole.Guest, UserRole.Host), createBooking);
// router.delete("/:id", checkAccessToken, allowRole(UserRole.Admin), deleteBooking);
// router.get("/property/:id", getBookingByPropertyId);
// router.get("/host/:id", checkAccessToken, allowRole(UserRole.Host, UserRole.Admin), getBookingByHostId);
// router.get("/user/:id", checkAccessToken, allowRole(UserRole.Guest), getBookingByUserId);
// router.put("/:id", checkAccessToken, allowRole(UserRole.Admin), updateBookingStatus);
// export default router;
