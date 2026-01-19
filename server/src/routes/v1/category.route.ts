import { Router } from 'express';
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  uploadMiddleware,
} from '../../modules/categories/category.controller';
import UserMiddlewares from "../../modules/user/user.middlewares";
import { UserRole } from "../../interfaces/jwtPayload.interfaces";

const router = Router();
const { checkAccessToken, allowRole } = UserMiddlewares;

// Route to create a new category with image upload
router.post('/', checkAccessToken, allowRole(UserRole.Admin),  uploadMiddleware({ folder: 'categories' }), createCategory);

// Route to get all categories
router.get('/', getCategories);

// Route to update a category with image upload
router.put('/:id', checkAccessToken, allowRole(UserRole.Admin), uploadMiddleware({ folder: 'categories' }), updateCategory);

// Route to delete a category
router.delete('/:id', checkAccessToken, allowRole(UserRole.Admin), deleteCategory);

export default router;
