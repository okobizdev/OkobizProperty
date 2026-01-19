import { Router } from 'express';
import * as amenitiesConfigController from './amenitiesConfig.controller';
import multer from 'multer';

const router = Router();
const upload = multer();

// AmenitiesConfig CRUD
router.post('/', upload.none(), amenitiesConfigController.createAmenitiesConfig);
router.get('/', amenitiesConfigController.getAllAmenitiesConfigs);
router.get('/:id', amenitiesConfigController.getAmenitiesConfigById);
router.put('/:id', upload.none(), amenitiesConfigController.updateAmenitiesConfig);
router.delete('/:id', amenitiesConfigController.deleteAmenitiesConfig);
router.get('/subcategory/:subcategoryId', amenitiesConfigController.getAmenitiesConfigBySubcategoryId);

export default router;
