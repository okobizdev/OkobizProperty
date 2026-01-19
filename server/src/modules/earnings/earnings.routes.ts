import { Router } from 'express';
import {
  createEarnings,
  getAllEarnings,
  getEarningsById,
  updateEarnings,
  deleteEarnings,
  getEarningsSummary,
  getEarningsByPropertyId,
  getPropertiesWhichHasEarnings,
} from './earnings.controller';
import { createUploadHandler } from '../../utils/imageUploader';

const router = Router();

// Upload middleware for earnings images
const uploadEarningsImage = createUploadHandler({
  folder: 'earnings',
  multiple: false,
  maxSize: 5 * 1024 * 1024, // 5MB
});

// Create a new earnings record
router.post('/', uploadEarningsImage, createEarnings);

// Get all earnings with date range filtering (query: from, to)
router.get('/', getAllEarnings);

// Get summary statistics for a date range (query: from, to)
router.get('/summary', getEarningsSummary);
router.get('/properties-with-earnings', getPropertiesWhichHasEarnings);

// Get a single earnings record by ID
router.get('/:id', getEarningsById);

//Get earnings by Property ID
router.get('/property/:propertyId', getEarningsByPropertyId);

// Update an earnings record by ID
router.put('/:id', uploadEarningsImage, updateEarnings);

// Delete an earnings record by ID
router.delete('/:id', deleteEarnings);



export default router;
