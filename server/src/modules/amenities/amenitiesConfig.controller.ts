import { Request, Response, RequestHandler } from 'express';
import AmenitiesConfig from './amenitiesConfig.model';

// Create a new amenities config
export const createAmenitiesConfig: RequestHandler = async (req, res) => {
  try {
    let { subcategory, availableAmenities } = req.body;
    // Handle availableAmenities as array or comma-separated string
    if (typeof availableAmenities === 'string') {
      availableAmenities = availableAmenities.split(',').map((id: string) => id.trim());
    }
    if (!subcategory) {
      res.status(400).json({ error: 'subcategory is required' });
      return;
    }
    console.log('Creating new amenities config:', { subcategory, availableAmenities });
    const config = new AmenitiesConfig({ subcategory, availableAmenities });
    await config.save();
    res.status(201).json(config);
    return;
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
    return;
  }
};

// Get all amenities configs
export const getAllAmenitiesConfigs: RequestHandler = async (_req, res) => {
  try {
    const configs = await AmenitiesConfig.find().populate('subcategory').populate('availableAmenities');
    res.json(configs);
    return;
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
    return;
  }
};

// Get amenities config by ID
export const getAmenitiesConfigById: RequestHandler = async (req, res) => {
  try {
    const config = await AmenitiesConfig.findById(req.params.id);
    if (!config) {
      res.status(404).json({ error: 'AmenitiesConfig not found' });
      return;
    }
    res.json(config);
    return;
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
    return;
  }
};

// Update amenities config
export const updateAmenitiesConfig: RequestHandler = async (req, res) => {
  try {
    let { availableAmenities } = req.body;
    // Handle availableAmenities as array or comma-separated string
    if (typeof availableAmenities === 'string') {
      availableAmenities = availableAmenities.split(',').map((id) => id.trim());
    }
    const updateData = { ...req.body, availableAmenities };
    const config = await AmenitiesConfig.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    if (!config) {
      res.status(404).json({ error: 'AmenitiesConfig not found' });
      return;
    }
    res.json(config);
    return;
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
    return;
  }
};

// Delete amenities config
export const deleteAmenitiesConfig: RequestHandler = async (req, res) => {
  try {
    const config = await AmenitiesConfig.findByIdAndDelete(req.params.id);
    if (!config) {
      res.status(404).json({ error: 'AmenitiesConfig not found' });
      return;
    }
    res.json({ message: 'AmenitiesConfig deleted' });
    return;
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
    return;
  }
};
export const getAmenitiesConfigBySubcategoryId: RequestHandler = async (req, res) => {
  try {
    const { subcategoryId } = req.params;
    const config = await AmenitiesConfig.findOne({ subcategory: subcategoryId });
    if (!config) {
      res.status(404).json({ error: 'AmenitiesConfig not found for this subcategory' });
      return;
    }
    res.json(config);
    return;
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
    return;
  }
}
