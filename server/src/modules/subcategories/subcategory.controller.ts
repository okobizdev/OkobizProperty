import { RequestHandler } from 'express';
import Subcategory from './subcategories.model';
import { createUploadHandler } from '../../utils/imageUploader';
import { UploadConfig } from '../../types/imageUploader.type';
import { imageUploader } from '../../utils/imageUploader';

const uploadConfig: UploadConfig = {
  folder: 'subcategories',
  maxSize: 2 * 1024 * 1024, // 2MB
  allowedTypes: [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml',
    'image/bmp',
    'image/tiff',
    'image/x-icon',
    'image/vnd.microsoft.icon',
    'image/vnd.adobe.photoshop',
  ],
};

const uploadHandler = createUploadHandler(uploadConfig);

// Create a new subcategory with image upload
export const createSubcategory: RequestHandler = async (req, res) => {
  console.log('Request Body:', req.body);
  console.log('Request File:', req.file);
  try {
    const { name, category, description, isActive, displayOrder, requiresDateRange, requiresGuestCount } = req.body;
    const allowedListingTypes =
      Array.isArray(req.body.allowedListingTypes)
        ? req.body.allowedListingTypes
        : req.body.allowedListingTypes
          ? JSON.parse(req.body.allowedListingTypes)
          : [];

    const uploadResult = await imageUploader.processUpload(req, uploadConfig);

    if (!uploadResult.success) {
      res.status(400).json({ error: uploadResult.error });
      return;
    }

    const image = uploadResult.file?.url || null;

    const subcategory = new Subcategory({
      name,
      category,
      description,
      isActive,
      displayOrder,
      image,
      allowedListingTypes,
      requiresDateRange,
      requiresGuestCount,
    });

    await subcategory.save();
    res.status(201).json(subcategory);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Get all subcategories
export const getAllSubcategories: RequestHandler = async (_req, res) => {
  try {
    const subcategories = await Subcategory.find()
      .populate('filterConfig')
      .populate('category')
      .populate({
        path: 'amenitiesConfig',
        populate: {
          path: 'availableAmenities',
          model: 'Amenity',
        },
      });
    res.json(subcategories);
    return;
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
    return;
  }
};

// Get subcategory by ID
export const getSubcategoryById: RequestHandler = async (req, res) => {
  try {
    const subcategory = await Subcategory.findById(req.params.id)
      .populate('filterConfig')
      .populate('category')
      .populate({
        path: 'amenitiesConfig',
        populate: {
          path: 'availableAmenities',
          model: 'Amenity',
        },
      });
    if (!subcategory) {
      res.status(404).json({ error: 'Subcategory not found' });
      return;
    }
    res.json(subcategory);
    return;
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
    return;
  }
};

// Update subcategory with image upload
export const updateSubcategory: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch the existing subcategory
    const subcategory = await Subcategory.findById(id);
    if (!subcategory) {
      res.status(404).json({ error: 'Subcategory not found' });
      return;
    }

    // If a new file is uploaded, delete the old image and update with the new one
    if (req.file) {
      if (subcategory.image) {
        await imageUploader.deleteFiles(subcategory.image);
      }
      req.body.image = `/uploads/subcategories/${req.file.filename}`;
    }

    // Update only the fields provided in the request body
    Object.assign(subcategory, req.body);

    await subcategory.save();
    res.status(200).json(subcategory);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

// Delete subcategory with image deletion
export const deleteSubcategory: RequestHandler = async (req, res) => {
  try {
    const subcategory = await Subcategory.findByIdAndDelete(req.params.id);
    if (!subcategory) {
      res.status(404).json({ error: 'Subcategory not found' });
      return;
    }

    // Delete the associated image
    if (subcategory.image) {
      await imageUploader.deleteFiles(subcategory.image);
    }

    res.json({ message: 'Subcategory deleted' });
    return;
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
    return;
  }
};

export { uploadHandler }; // Export the upload handler for use in routes