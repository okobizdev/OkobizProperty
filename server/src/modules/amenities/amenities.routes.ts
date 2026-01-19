import { Router } from 'express';
import * as amenitiesController from './amenities.controller';
import uploadMiddleware from '../../middlewares/uploadMiddleware';

const router = Router();
//7 7 6 20 
// Amenities CRUD
// Route to create a new amenity with image upload
router.post('/', uploadMiddleware({ folder: 'amenities' }), amenitiesController.createAmenity);
// Route to update an amenity with image upload
router.put('/:id', uploadMiddleware({ folder: 'amenities' }), amenitiesController.updateAmenity);
router.get('/', amenitiesController.getAllAmenities);
router.get('/:id', amenitiesController.getAmenityById);
router.delete('/:id', amenitiesController.deleteAmenity);

export default router;
