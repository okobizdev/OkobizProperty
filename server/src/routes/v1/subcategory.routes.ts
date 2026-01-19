import { Router } from 'express';
import * as subcategoryController from '../../modules/subcategories/subcategory.controller';
import uploadMiddleware from '../../middlewares/uploadMiddleware';
import UserMiddlewares from "../../modules/user/user.middlewares";
import { UserRole } from "../../interfaces/jwtPayload.interfaces";

const router = Router();
const { checkAccessToken, allowRole } = UserMiddlewares;

// Subcategory CRUD
router.post(
  '/',
  checkAccessToken,
  allowRole(UserRole.Admin),
  uploadMiddleware({ folder: 'subcategories' }),
  subcategoryController.createSubcategory
);
router.get('/', subcategoryController.getAllSubcategories);
router.get('/:id', subcategoryController.getSubcategoryById);
router.put(
  '/:id',
  uploadMiddleware({ folder: 'subcategories' }),
  subcategoryController.updateSubcategory
);
router.delete('/:id', checkAccessToken, allowRole(UserRole.Admin), subcategoryController.deleteSubcategory);


export default router;
