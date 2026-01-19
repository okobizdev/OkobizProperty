import { Router } from 'express';
import UserMiddlewares from '../../modules/user/user.middlewares';
import { UserRole } from '../../interfaces/jwtPayload.interfaces';
import HostGuideController from '../../modules/hostGuide/hostguide.controller';
const { handleCreateHostingGuideVideo, handleGetHostingGuideVideo, handleEditHostingGuideVideo, handleDeleteHostingGuideVideo } = HostGuideController

const { checkAccessToken, allowRole } = UserMiddlewares;

const router = Router();

router.route('/admin/create-host-guide-video').post(checkAccessToken, allowRole(UserRole.Admin, UserRole.AccountAdministrator), handleCreateHostingGuideVideo);
router.route('/get-host-guide-video').get(checkAccessToken, handleGetHostingGuideVideo);

router
    .route('/admin/edit-host-guide-video/:id')
    .patch(checkAccessToken, allowRole(UserRole.Admin, UserRole.AccountAdministrator), handleEditHostingGuideVideo);


router
    .route('/admin/delete-guided-video/:id')
    .delete(
        checkAccessToken,
        allowRole(UserRole.Admin, UserRole.AccountAdministrator),
        handleDeleteHostingGuideVideo
    );

export default router;
