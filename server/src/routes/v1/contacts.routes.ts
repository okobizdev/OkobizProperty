import { Router } from 'express';
import UserMiddlewares from '../../modules/user/user.middlewares';
import ContactsControllers from '../../modules/contacts/contacts.controllers';
import { UserRole } from '../../interfaces/jwtPayload.interfaces';
import upload from '../../middlewares/multer.middleware';

const { handleCreateContactMessage, handleDeleteContactMessage, handleFindAllContactsMessages } =
  ContactsControllers;
const { checkAccessToken, allowRole } = UserMiddlewares;

const router = Router();

router.route('/create-contact').post(upload.none(), handleCreateContactMessage);

router.route('/admin/contacts').get(handleFindAllContactsMessages);

router
  .route('/admin/contacts/:id')
  .delete(
    checkAccessToken,
    allowRole(UserRole.Admin, UserRole.AccountAdministrator),
    handleDeleteContactMessage
  );

export default router;
