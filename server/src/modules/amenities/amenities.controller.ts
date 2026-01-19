import {  RequestHandler } from 'express';
import Amenity from './amenties.model';
import { imageUploader, createUploadHandler } from '../../utils/imageUploader';
import { UploadConfig } from '../../types/imageUploader.type';

// Upload configuration for amenity images
const uploadConfig: UploadConfig = {
  folder: 'amenities',
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
    'image/avif'
  ],
};

// Middleware for handling image uploads
const uploadHandler = createUploadHandler(uploadConfig);

// Create a new amenity
export const createAmenity: RequestHandler = async (req, res) => {
  try {
    const uploadResult = await imageUploader.processUpload(req, uploadConfig);

    if (!uploadResult.success) {
      res.status(400).json({ error: uploadResult.error });
      return;
    }

    const { label } = req.body;
    const image = uploadResult.file?.url || null;

    const amenity = new Amenity({
      label,
      image,
    });

    await amenity.save();
    res.status(201).json(amenity);
    return;
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
    return;
  }
};

// Get all amenities
export const getAllAmenities: RequestHandler = async (_req, res) => {
  try {
    const amenities = await Amenity.find();
    res.json(amenities);
    return;
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
    return;
  }
};

// Get amenity by ID
export const getAmenityById: RequestHandler = async (req, res) => {
  try {
    const amenity = await Amenity.findById(req.params.id);
    if (!amenity) {
      res.status(404).json({ error: 'Amenity not found' });
      return;
    }
    res.json(amenity);
    return;
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
    return;
  }
};

// Update amenity
export const updateAmenity: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { label } = req.body;

    const existingAmenity = await Amenity.findById(id);
    if (!existingAmenity) {
      res.status(404).json({ error: 'Amenity not found' });
      return;
    }

    let image = existingAmenity.image;

    if (req.file) {
      try {
        if (existingAmenity.image) {
          await imageUploader.deleteFiles(existingAmenity.image);
        }
      } catch (imageError) {
        console.warn(`Failed to delete old image file: ${existingAmenity.image}`, imageError);
      }

      const uploadResult = await imageUploader.processUpload(req, uploadConfig);
      if (!uploadResult.success) {
        res.status(400).json({ error: uploadResult.error });
        return;
      }
      image = uploadResult.file?.url || image;
    }

    const amenity = await Amenity.findByIdAndUpdate(id, { label, image }, { new: true });

    res.status(200).json(amenity);
    return;
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
    return;
  }
};

// Delete amenity
export const deleteAmenity: RequestHandler = async (req, res) => {
  try {
    const amenity = await Amenity.findByIdAndDelete(req.params.id);
    if (!amenity) {
      res.status(404).json({ error: 'Amenity not found' });
      return;
    }

    // Delete the associated image file if it exists
    if (amenity.image) {
      try {
        await imageUploader.deleteFiles(amenity.image);
      } catch (imageError) {
        console.warn(`Failed to delete image file: ${amenity.image}`, imageError);
      }
    }

    res.json({ message: 'Amenity deleted successfully' });
    return;
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
    return;
  }
};
