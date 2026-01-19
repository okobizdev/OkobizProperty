
import { Request, Response, NextFunction } from 'express';
import logger from '../../configs/logger.configs';
import HostGuideService from './hostguide.service';



const HostGuideController = {
    handleCreateHostingGuideVideo: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const payload = { ...req.body };
            const guederesult = await HostGuideService.createHostGuideVideo(payload);
            res.status(201).json({
                status: 'success',
                message: 'guideresult create successfully',
                data: guederesult,
            });
        } catch (error) {
            const err = error as Error;
            logger.error(err.message);
            next(err);
        }
    },
    handleGetHostingGuideVideo: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const guideresult = await HostGuideService.handlegetHostGuideVideo();
            if (!guideresult) {

                res.status(404).json({
                    status: 'error',
                    message: 'No Host Guide Video found',
                    errors: [
                        'No Host Guide Video found',

                    ]
                });
                return;
            }

            res.status(200).json({
                status: 'success',
                message: ` hosting guide video retrieved successfully`,
                data: guideresult,
            });
        } catch (error) {
            const err = error as Error;
            logger.error(err.message);
            next(err);
        }
    },
    handleEditHostingGuideVideo: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const hostGuideId = req.params.id;
            const payload = { ...req.body };
            const updatedHostGuide = await HostGuideService.editHostGuideVideo(hostGuideId, payload);
            res.status(200).json({
                status: 'success',
                message: 'Hosting guide video updated successfully',
                data: updatedHostGuide,
            });
        } catch (error) {
            const err = error as Error;
            logger.error(err.message);
            next(err);
        }
    },

    handleDeleteHostingGuideVideo: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const hostGuideId = req.params.id;
            const deletedHostGuide = await HostGuideService.deleteHostGuideVideo(hostGuideId);
            res.status(200).json({
                status: 'success',
                message: 'Hosting guide video deleted successfully',
                data: deletedHostGuide,
            });
        } catch (error) {
            const err = error as Error;
            logger.error(err.message);
            next(err);
        }
    },

};

export default HostGuideController;