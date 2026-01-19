import { Router } from 'express';
import * as propertyController from '../../modules/properties/property.controller';
import {
  uploadPropertyImages,
} from '../../modules/properties/property.controller';
import UserMiddlewares from '../../modules/user/user.middlewares';
import { UserRole } from '../../interfaces/jwtPayload.interfaces';

const router = Router();
const { checkAccessToken, allowRole, assignRole } = UserMiddlewares;

router.post(
  '/',
  checkAccessToken,
  allowRole(UserRole.Admin, UserRole.Host),
  uploadPropertyImages,
  propertyController.createProperty
);

router.get('/', assignRole, propertyController.getAllProperties);
router.get('/featured', propertyController.getFeaturedProperties);
router.get('/host/:id', checkAccessToken, allowRole(UserRole.Admin, UserRole.Host), propertyController.getPropertyByHostId);
router.get('/slug/:slug', propertyController.getPropertyBySlug);
router.get('/:id', propertyController.getPropertyById);

router.put(
  '/:id',
  checkAccessToken,
  allowRole(UserRole.Admin, UserRole.Host),
  uploadPropertyImages,
  propertyController.updateProperty
);

router.delete(
  '/:id',
  checkAccessToken,
  allowRole(UserRole.Admin),
  propertyController.deleteProperty
);

// PATCH: Update publishStatus
router.patch(
  '/:id/publish-status',
  checkAccessToken,
  allowRole(UserRole.Admin),
  propertyController.updatePropertyPublishStatus
);
router.patch(
  '/:id/featured-status',
  checkAccessToken,
  allowRole(UserRole.Admin),
  propertyController.updatePropertyFeaturedStatus
);

export default router;
