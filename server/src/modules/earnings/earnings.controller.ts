import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Earnings from './earnings.model';
import { imageUploader } from '../../utils/imageUploader';

// Create a new earnings record
export const createEarnings = async (req: Request, res: Response) => {
  try {
    const {
      property,
      revenue,
      cost,
      profitMargin,
      transactionDate,
      bookingReference,
      paymentStatus,
      commissionType,
    } = req.body;
    const profit = Number(revenue) - Number(cost);

    console.log('Create Earnings Request Body:', req.body);
    console.log('Create Earnings Request File:', req.file);

    let imageUrl = '';
    if (req.file) {
      const uploadConfig = {
        folder: 'earnings',
        multiple: false,
        maxSize: 5 * 1024 * 1024, // 5MB
      };
      const uploadResult = await imageUploader.processUpload(req, uploadConfig);
      if (uploadResult.success && uploadResult.file) {
        imageUrl = uploadResult.file.url;
      } else {
        res.status(400).json({ error: uploadResult.error || 'Image upload failed' });
        return;
      }
    }

    const earnings = await Earnings.create({
      property,
      revenue,
      cost,
      profit,
      profitMargin,
      transactionDate,
      bookingReference,
      paymentStatus,
      commissionType,
      image: imageUrl || undefined,
    });
    res.status(201).json(earnings);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Get all earnings with date range filtering (query: from, to)
export const getAllEarnings = async (req: Request, res: Response) => {
  try {
    const { from, to } = req.query;
    const filter: any = {};
    if (from || to) {
      filter.transactionDate = {};
      if (from) filter.transactionDate.$gte = new Date(from as string);
      if (to) filter.transactionDate.$lte = new Date(to as string);
    }
    const earnings = await Earnings.find(filter)
      .populate('property')
      .populate('bookingReference', 'checkInDate checkOutDate');
    res.json(earnings);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Get a single earnings record by ID
export const getEarningsById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ error: 'Invalid ID' });
      return;
    }
    const earnings = await Earnings.findById(id)
      .populate('property', 'title location')
      .populate('bookingReference', 'checkInDate checkOutDate');
    if (!earnings) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    res.json(earnings);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Update an earnings record by ID
export const updateEarnings = async (req: Request, res: Response) => {
  console.log('Update Earnings Request Body:', req.body);
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ error: 'Invalid ID' });
      return;
    }
    const updateData = { ...req.body };

    // Coerce numeric fields (for form-data)
    ['revenue', 'cost', 'profitMargin'].forEach((field) => {
      if (updateData[field] !== undefined) {
        updateData[field] = Number(updateData[field]);
      }
    });

    // Fetch current record for profit calculation and old image
    const current = await Earnings.findById(id);
    if (!current) {
      res.status(404).json({ error: 'Not found' });
      return;
    }

    // Handle image upload
    if (req.file) {
      const uploadConfig = {
        folder: 'earnings',
        multiple: false,
        maxSize: 5 * 1024 * 1024, // 5MB
      };
      const uploadResult = await imageUploader.processUpload(req, uploadConfig, current.image);
      if (uploadResult.success && uploadResult.file) {
        updateData.image = uploadResult.file.url;
      } else {
        res.status(400).json({ error: uploadResult.error || 'Image upload failed' });
        return;
      }
    }

    // Calculate profit if revenue or cost is updated
    const revenue = updateData.revenue !== undefined ? Number(updateData.revenue) : current.revenue;
    const cost = updateData.cost !== undefined ? Number(updateData.cost) : current.cost;
    updateData.profit = revenue - cost;

    // Update the record
    const updated = await Earnings.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate('property', 'title location')
      .populate('bookingReference');

    if (!updated) {
      res.status(404).json({ error: 'Not found after update' });
      return;
    }
    res.json(updated);
  } catch (error) {
    // Log error for debugging
    console.error('Update Earnings Error:', error);
    res.status(500).json({ error: (error as Error).message });
  }
};

// Delete an earnings record by ID
export const deleteEarnings = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ error: 'Invalid ID' });
      return;
    }
    const earnings = await Earnings.findById(id);
    if (!earnings) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    // Delete associated image
    if (earnings.image) {
      await imageUploader.deleteFiles(earnings.image);
    }
    const deleted = await Earnings.findByIdAndDelete(id);
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Get summary statistics for a date range (query: from, to)
export const getEarningsSummary = async (req: Request, res: Response) => {
  try {
    const { from, to } = req.query;
    const match: any = {};
    if (from || to) {
      match.transactionDate = {};
      if (from) match.transactionDate.$gte = new Date(from as string);
      if (to) match.transactionDate.$lte = new Date(to as string);
    }
    const summary = await Earnings.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$revenue' },
          totalCost: { $sum: '$cost' },
          totalProfit: { $sum: '$profit' },
          averageProfitMargin: { $avg: '$profitMargin' },
          count: { $sum: 1 },
        },
      },
    ]);
    res.json(
      summary[0] || {
        totalRevenue: 0,
        totalCost: 0,
        totalProfit: 0,
        averageProfitMargin: 0,
        count: 0,
      }
    );
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getEarningsByPropertyId = async (req: Request, res: Response) => {
  try {
    const { propertyId } = req.params;
    if (!mongoose.isValidObjectId(propertyId)) {
      res.status(400).json({ error: 'Invalid Property ID' });
      return;
    }
    const earnings = await Earnings.find({ property: propertyId })
      .populate('property', 'title location')
      .populate({
        path: 'bookingReference',
        populate: {
          path: 'userId',
          model: 'User',
        },
      });

    res.json(earnings);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getPropertiesWhichHasEarnings = async (req: Request, res: Response) => {
  console.log('Fetching properties with earnings');
  try {
    // Get distinct property IDs from earnings
    const propertyIds = await Earnings.distinct('property');

    // Import Property model (assuming it's in the same directory or nearby)
    const Property =
      require('../properties/property.model').default || require('../properties/property.model');

    // Fetch unique properties that have earnings
    const properties = await Property.find({ _id: { $in: propertyIds } }).select(
      'title location price priceUnit size sizeUnit numberOfRooms numberOfWashrooms numberOfGuests numberOfBalconies numberOfBedrooms images coverImage category subcategory listingType amenities host publishStatus isSold createdAt updatedAt'
    );

    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
