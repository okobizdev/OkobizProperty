import { Router } from 'express';
import * as filterConfigController from './property.filters.controller';

const router = Router();

// FilterConfig CRUD
router.post('/', filterConfigController.createFilterConfig);
router.get('/', filterConfigController.getAllFilterConfigs);
router.get('/:id', filterConfigController.getFilterConfigById);

// Get filter config by subcategory (most important for frontend)
router.get('/subcategory/:subcategoryId', filterConfigController.getFilterConfigBySubcategory);

router.put('/:id', filterConfigController.updateFilterConfig);
router.delete('/:id', filterConfigController.deleteFilterConfig);

export default router;
