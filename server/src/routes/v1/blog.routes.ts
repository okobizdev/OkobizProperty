import { Router } from 'express';
import UserMiddlewares from '../../modules/user/user.middlewares';
import upload from '../../middlewares/multer.middleware';
import BlogControllers from '../../modules/blog/blog.controllers';
import BlogMiddlewares from '../../modules/blog/blog.middlewares';
import { UserRole } from '../../interfaces/jwtPayload.interfaces';
const { checkAccessToken, allowRole } = UserMiddlewares;
const {
  handleCreateBlog,
  handleUpdateBlog,
  handleBlogDelete,
  handleRetrieveBlog,
  handleRetrieveSingleBlog,
  handleUpdateBlogField,
} = BlogControllers;
const { isBlogExist } = BlogMiddlewares;
const router = Router();

router
  .route('/blog')
  .get(handleRetrieveBlog)
  .post(
    checkAccessToken,
    allowRole(UserRole.Admin, UserRole.ContentManager),
    upload.single('blogImage'),
    handleCreateBlog
  );

router.route('/blog/:slug').get(handleRetrieveSingleBlog);

router
  .route('/blog/:id')
  .patch(
    checkAccessToken,
    upload.none(),
    allowRole(UserRole.Admin, UserRole.ContentManager),
    handleUpdateBlogField
  )
  .put(
    checkAccessToken,
    allowRole(UserRole.Admin, UserRole.ContentManager),
    isBlogExist,
    upload.single('blogImage'),
    handleUpdateBlog
  )
  .delete(
    checkAccessToken,
    allowRole(UserRole.Admin, UserRole.ContentManager),
    isBlogExist,
    handleBlogDelete
  );

export default router;
