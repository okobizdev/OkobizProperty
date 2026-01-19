import { Router } from 'express';
import UserMiddlewares from '../../modules/user/user.middlewares';
import upload from '../../middlewares/multer.middleware';
import LocationControllers from '../../modules/location/location.controllers';
import { UserRole } from '../../interfaces/jwtPayload.interfaces';

const { checkAccessToken, isHost, allowRole } = UserMiddlewares;
const {
  handleCreateLocation,
  handleGetLocation,
  handleUpdateLocation,
  handleDeleteLocation,
  handleGetLocationByStringSearch,
} = LocationControllers;

const router = Router();

// HOST ROUTES
router.route('/location')
.post(checkAccessToken,  allowRole(UserRole.Admin, UserRole.ListingVerificationManager), handleCreateLocation)
.get(checkAccessToken,  allowRole(UserRole.Admin, UserRole.ListingVerificationManager), handleGetLocation);

//  update location and delete location
router
  .route('/location/:id')
  .patch(checkAccessToken, allowRole(UserRole.Admin, UserRole.ListingVerificationManager), handleUpdateLocation)
  .delete(checkAccessToken, allowRole(UserRole.Admin, UserRole.ListingVerificationManager), handleDeleteLocation);
router.route('/location/search/:string').get(handleGetLocationByStringSearch);

export default router;
