import { Router } from 'express';
import UserMiddlewares from '../../modules/user/user.middlewares';
import WhyChooseUsControllers from '../../modules/whyChooseUs/whyChooseUs.controllers';
import { UserRole } from '../../interfaces/jwtPayload.interfaces';
import upload from '../../middlewares/multer.middleware';
import WhyChooseUsMiddlewares from '../../modules/whyChooseUs/whyChooseUs.middlewares';
const { checkAccessToken, allowRole } = UserMiddlewares;
const { isWhyChooseUsExist } = WhyChooseUsMiddlewares;
const {
  handleCreateWhyChooseUs,
  handleDeleteWhyChooseUs,
  handleRetrieveAllWhyChooseUs,
  handleUpdateWhyChooseUs,
  handleUpdateWhyChooseUsField,
} = WhyChooseUsControllers;

const router = Router();

router.route('/why-choose-us').get(handleRetrieveAllWhyChooseUs);

router
  .route('/admin/why-choose-us')
  .post(
    checkAccessToken,
    allowRole(UserRole.Admin, UserRole.ContentManager),
    upload.single('whyChooseUsIcon'),
    handleCreateWhyChooseUs
  );

router
  .route('/admin/why-choose-us/:id')
  .put(
    checkAccessToken,
    allowRole(UserRole.Admin, UserRole.ContentManager),
    isWhyChooseUsExist,
    upload.single('whyChooseUsIcon'),
    handleUpdateWhyChooseUs
  )
  .patch(
    checkAccessToken,
    upload.none(),
    allowRole(UserRole.Admin, UserRole.ContentManager),
    handleUpdateWhyChooseUsField
  )
  .delete(
    checkAccessToken,
    allowRole(UserRole.Admin, UserRole.ContentManager),
    isWhyChooseUsExist,
    handleDeleteWhyChooseUs
  );

export default router;
