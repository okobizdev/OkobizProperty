import { Router } from 'express';
// import { createCompanyContacts, getCompanyContacts, updateCompanyContacts } from '../../modules/contactinfo';
import UserMiddlewares from '../../modules/user/user.middlewares';
import { UserRole } from '../../interfaces/jwtPayload.interfaces';
import { createCompanyContacts, deleteCompanyContacts, getCompanyContacts, updateCompanyContacts } from '../../modules/contactinfo/contacts.controller';

const { checkAccessToken, allowRole } = UserMiddlewares
const router = Router();


router.get('/', getCompanyContacts);
router.post('/', checkAccessToken, allowRole(UserRole.Admin, UserRole.AccountAdministrator), createCompanyContacts);
router.put('/:id', checkAccessToken, allowRole(UserRole.Admin, UserRole.AccountAdministrator), updateCompanyContacts);
router.delete('/:id', checkAccessToken, allowRole(UserRole.Admin, UserRole.AccountAdministrator), deleteCompanyContacts);

export default router;
