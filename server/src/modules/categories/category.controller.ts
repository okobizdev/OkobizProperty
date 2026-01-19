import { Request, Response } from 'express';
import Category from './category.model';
import { imageUploader, createUploadHandler } from '../../utils/imageUploader';
import { UploadConfig } from '../../types/imageUploader.type';
import uploadMiddleware from '../../middlewares/uploadMiddleware';

// Upload configuration for category images
const uploadConfig: UploadConfig = {
  folder: 'categories',
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

// Middleware for handling image uploads
const uploadHandler = createUploadHandler(uploadConfig);

// Create a new category
export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const uploadResult = await imageUploader.processUpload(req, uploadConfig);

    if (!uploadResult.success) {
      res.status(400).json({ error: uploadResult.error });
      return;
    }

    const { name, description, isActive, displayOrder, listingType } = req.body;
    const image = uploadResult.file?.url || null;

    const category = new Category({
      name,
      description,
      isActive,
      displayOrder,
      image,
      listingType,
    });

    await category.save();
    res.status(201).json(category);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: errorMessage });
  }
};

// Get all categories
export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.find()
       .populate({ path: 'subcategories', select: 'name image' }); // Use the virtual field name
    res.status(200).json(categories);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: errorMessage });
  }
};

// Update a category
export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, isActive, displayOrder } = req.body;

    // Fetch the existing category to get the old image
    const existingCategory = await Category.findById(id);
    if (!existingCategory) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }

    let image = existingCategory.image;

    // If a new file is uploaded, delete the old image and update with the new one
    if (req.file) {
      try {
        if (existingCategory.image) {
          await imageUploader.deleteFiles(existingCategory.image);
        }
      } catch (imageError) {
        console.warn(`Failed to delete old image file: ${existingCategory.image}`, imageError);
      }
      const uploadResult = await imageUploader.processUpload(req, uploadConfig);
      if (!uploadResult.success) {
        res.status(400).json({ error: uploadResult.error });
        return;
      }
      image = uploadResult.file?.url || image;
    }

    const category = await Category.findByIdAndUpdate(
      id,
      { name, description, isActive, displayOrder, image },
      { new: true }
    );

    res.status(200).json(category);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: errorMessage });
  }
};

// Delete a category
export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }

    // Delete the associated image file if it exists
    if (category.image) {
      try {
        await imageUploader.deleteFiles(category.image);
        console.log(`Successfully deleted image for category: ${category.name}`);
      } catch (imageError) {
        console.warn(`Failed to delete image file: ${category.image}`, imageError);
        // Continue with category deletion even if image deletion fails
      }
    }

    // Delete the category from database
    await Category.findByIdAndDelete(id);

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: errorMessage });
  }
};

export { uploadHandler, uploadMiddleware };
