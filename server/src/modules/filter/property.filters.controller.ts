import { Request, Response, RequestHandler } from 'express';
import FilterConfig from './property.filters.model';

// Get filter config by subcategory ID (most important for your use case)
export const getFilterConfigBySubcategory: RequestHandler = async (req, res) => {
  try {
    const { subcategoryId } = req.params;
    const config = await FilterConfig.findOne({ subcategory: subcategoryId }).populate(
      'subcategory',
      'name'
    );

    if (!config) {
      res.status(404).json({ error: 'FilterConfig not found for this subcategory' });
      return;
    }

    res.json(config);
    return;
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
    return;
  }
};

// Create a new filter config
export const createFilterConfig: RequestHandler = async (req, res) => {
  try {
    const config = new FilterConfig(req.body);
    await config.save();
    res.status(201).json(config);
    return;
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
    return;
  }
};

// Get all filter configs
export const getAllFilterConfigs: RequestHandler = async (_req, res) => {
  try {
    const configs = await FilterConfig.find();
    res.json(configs);
    return;
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
    return;
  }
};

// Get filter config by ID
export const getFilterConfigById: RequestHandler = async (req, res) => {
  try {
    const config = await FilterConfig.findById(req.params.id);
    if (!config) {
      res.status(404).json({ error: 'FilterConfig not found' });
      return;
    }
    res.json(config);
    return;
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
    return;
  }
};

// Update filter config
export const updateFilterConfig: RequestHandler = async (req, res) => {
  try {
    const config = await FilterConfig.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!config) {
      res.status(404).json({ error: 'FilterConfig not found' });
      return;
    }
    res.json(config);
    return;
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
    return;
  }
};

// Delete filter config
export const deleteFilterConfig: RequestHandler = async (req, res) => {
  try {
    const config = await FilterConfig.findByIdAndDelete(req.params.id);
    if (!config) {
      res.status(404).json({ error: 'FilterConfig not found' });
      return;
    }
    res.json({ message: 'FilterConfig deleted' });
    return;
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
    return;
  }
};
