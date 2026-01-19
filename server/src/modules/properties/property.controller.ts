import { RequestHandler } from 'express';
import { Types } from 'mongoose';
import Property from './property.model';
import { imageUploader } from '../../utils/imageUploader';
import { UploadConfig } from '../../types/imageUploader.type';
import uploadMiddleware from '../../middlewares/uploadMiddleware';
import Booking from '../bookings/booking.model.v2';
import { Request, Response } from 'express';
import { error } from 'console';

// Upload configurations
const imageUploadConfig: UploadConfig = {
  folder: 'properties/images',
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'],
  multiple: true,
  maxCount: 10,
};

// Create upload middleware
const uploadPropertyImages = uploadMiddleware(imageUploadConfig);

// Create a new property with images and video (video as string)
const createProperty: RequestHandler = async (req, res) => {
  try {
    let images: string[] = [];
    let video: string | null = null;
    let coverImage: string | null = null;

    // Process image uploads
    if (req.files && Array.isArray(req.files)) {
      const imageUploadResult = await imageUploader.processUpload(req, imageUploadConfig);
      if (imageUploadResult.success && imageUploadResult.files) {
        images = imageUploadResult.files.map((file) => file.url);
        coverImage = images[0] || null; // First image as cover
      }
    }

    // Get video as string from req.body
    if (req.body.video) {
      video = req.body.video;
    }

    const propertyData = {
      ...req.body,
      images,
      video,
      coverImage,
    };

    const property = new Property(propertyData);
    await property.save();

    res.status(201).json(property);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

// Get all properties with dynamic filtering
const getAllProperties: RequestHandler = async (req, res) => {
  try {
    // Extract query parameters
    const {
      listingType,
      category,
      subcategory,
      price_min,
      price_max,
      size_min,
      size_max,
      location,
      numberOfRooms,
      numberOfWashrooms,
      airConditioning,
      numberOfGuests,
      numberOfBalconies,
      numberOfBedrooms,
      amenities,
      page = 1,
      limit = 9,
      sort = 'createdAt',
      order = 'desc',
      checkinDate,
      checkoutDate,
      bedType,
      smokingAllowed,
    } = req.query;

    //query based on publishStatus

    // publishStatus: {
    //   type: String,
    //   enum: ['IN_PROGRESS', 'PUBLISHED', 'SOLD', 'RENTED', 'DRAFT'],
    //   default: 'IN_PROGRESS',
    // },

    // Build dynamic query
    const query: Record<string, any> = {};

    if (req.role === null || req.role === 'guest' || req.role === 'host') {
      // Only allow PUBLISHED, SOLD, RENTED for guests and non-authenticated users
      query.publishStatus = { $in: ['PUBLISHED', 'SOLD', 'RENTED'] };
    }

    // Add filters based on query parameters
    if (listingType) query.listingType = { $regex: `^${listingType}$`, $options: 'i' };
    if (subcategory) query.subcategory = subcategory;
    if (category) query.category = category;

    // Handle range filters (price, size)
    if (price_min || price_max) {
      query.price = {};
      if (price_min) query.price.$gte = Number(price_min);
      if (price_max) query.price.$lte = Number(price_max);
    }

    if (size_min || size_max) {
      query.size = {};
      if (size_min) query.size.$gte = Number(size_min);
      if (size_max) query.size.$lte = Number(size_max);
    }

    // Handle text search (location)
    if (location) query.location = { $regex: location, $options: 'i' };

    // Handle exact match filters
    if (numberOfRooms) query.numberOfRooms = Number(numberOfRooms);
    if (numberOfWashrooms) query.numberOfWashrooms = Number(numberOfWashrooms);
    if (numberOfBalconies) query.numberOfBalconies = Number(numberOfBalconies);
    if (numberOfBedrooms) query.numberOfBedrooms = Number(numberOfBedrooms);
    if (numberOfGuests) {
      // Show properties where numberOfGuests is greater than or equal to the requested value
      query.numberOfGuests = { $gte: Number(numberOfGuests) };
    }
    if (bedType) query.bedType = bedType;
    if (smokingAllowed !== undefined) {
      if (smokingAllowed === 'true') {
        query.smokingAllowed = true;
      } else {
        query.smokingAllowed = false;
      }
    }

    // Handle amenities filtering
    if (amenities) {
      const amenityIds = Array.isArray(amenities) ? amenities : [amenities];
      query.amenities = { $in: amenityIds };
    }
    // Handle airConditioning filtering
    if (airConditioning !== undefined) {
      if (airConditioning === 'true') {
        query.airConditioning = true;
      } else {
        query.airConditioning = false;
      }
    }

    // Date availability filtering based on your business logic
    if (checkinDate && checkoutDate) {
      const requestedCheckIn = new Date(checkinDate as string);
      const requestedCheckOut = new Date(checkoutDate as string);

      // 1. Filter properties by their availability window (checkinDate and checkoutDate)
      // ONLY show properties that have availability dates set AND cover the requested dates
      query.$and = query.$and || [];
      query.$and.push({
        checkinDate: { $ne: null }, // Must have availability start date
        checkoutDate: { $ne: null }, // Must have availability end date
      });
      query.$and.push({
        checkinDate: { $lte: requestedCheckIn }, // Availability starts before or on requested check-in
        checkoutDate: { $gte: requestedCheckOut }, // Availability ends after or on requested check-out
      });

      // 2. Filter out properties with blocked dates that overlap with requested dates
      // Properties should NOT have any blocked dates between requestedCheckIn and requestedCheckOut
      query.blockedDates = {
        $not: {
          $elemMatch: {
            $gte: requestedCheckIn,
            $lt: requestedCheckOut,
          },
        },
      };


      // 3. Find properties with conflicting bookings and exclude them
      const conflictingBookings = await Booking.find({
        status: { $in: ['confirmed', 'pending'] },
        // Check for date overlap in bookings
        $and: [
          { checkInDate: { $ne: null } },
          { checkOutDate: { $ne: null } },
          { checkInDate: { $lt: requestedCheckOut } },
          { checkOutDate: { $gt: requestedCheckIn } },
        ],
      }).distinct('propertyId');

      // Exclude properties with conflicting bookings
      if (conflictingBookings.length > 0) {
        query._id = { $nin: conflictingBookings };
      }
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Execute query with filters, sorting, and pagination
    const properties = await Property.find(query)
      .populate('category', 'name')
      .populate('subcategory', 'name')
      .populate('amenities', 'label image')
      .populate('host', 'name email phone')
      .sort({ [String(sort)]: order === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(Number(limit));

    // Get total count for pagination
    const total = await Property.countDocuments(query);

    // Calculate total pages
    const totalPages = Math.ceil(total / Number(limit));

    res.json({
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages,
      properties,
    });
  } catch (error) {
    console.error('Error in getAllProperties:', error);
    res.status(500).json({ error: (error as Error).message });
  }
};

// Get property by ID
const getPropertyById: RequestHandler = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('category', 'name')
      .populate('subcategory', 'name')
      .populate('amenities', 'label image')
      .populate('host', 'name email');

    if (!property) {
      res.status(404).json({ error: 'Property not found' });
      return;
    }
    res.json(property);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

const getPropertyBySlug: RequestHandler = async (req, res) => {
  try {
    const property = await Property.findOne({ slug: req.params.slug })
      .populate('category', 'name')
      .populate('subcategory', 'name')
      .populate('amenities', 'label image')
      .populate('host', 'name email');

    if (!property) {
      res.status(404).json({ error: 'Property not found' });
      return
    }
    res.json(property);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}

// Update property with images and video (video as string)
const updateProperty: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch existing property
    const existingProperty = await Property.findById(id);
    if (!existingProperty) {
      res.status(404).json({ error: 'Property not found' });
      return;
    }

    let images = [...(existingProperty.images || [])]; // Start with existing images
    let video = existingProperty.video;
    let coverImage = existingProperty.coverImage;

    // Handle image deletions
    if (req.body.imagesToDelete) {
      const imagesToDelete = Array.isArray(req.body.imagesToDelete)
        ? req.body.imagesToDelete
        : [req.body.imagesToDelete];

      try {
        // Delete specified images from storage
        await imageUploader.deleteFiles(imagesToDelete);

        // Remove deleted images from the images array
        images = images.filter(img => !imagesToDelete.includes(img));
      } catch (imageError) {
        console.warn('Failed to delete some images:', imageError);
      }
    }

    // Handle new image uploads (add to existing images)
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      const imageUploadResult = await imageUploader.processUpload(req, imageUploadConfig);
      if (imageUploadResult.success && imageUploadResult.files) {
        const newImages = imageUploadResult.files.map((file) => file.url);
        images = [...images, ...newImages]; // Add new images to existing ones
      }
    }

    // Handle image reordering (if provided)
    if (req.body.imageOrder && Array.isArray(req.body.imageOrder)) {
      // Reorder images based on provided order
      const reorderedImages = [];
      for (const imageUrl of req.body.imageOrder) {
        if (images.includes(imageUrl)) {
          reorderedImages.push(imageUrl);
        }
      }
      // Add any remaining images that weren't in the order array
      for (const img of images) {
        if (!reorderedImages.includes(img)) {
          reorderedImages.push(img);
        }
      }
      images = reorderedImages;
    }

    // Update cover image
    if (req.body.coverImage) {
      // Use specified cover image if it exists in the images array
      if (images.includes(req.body.coverImage)) {
        coverImage = req.body.coverImage;
      }
    } else if (images.length > 0) {
      // Use first image as cover if no specific cover is set
      coverImage = images[0];
    } else {
      coverImage = null;
    }

    // Get video as string from req.body
    if (req.body.video !== undefined) {
      video = req.body.video;
    }

    const updateData = {
      ...req.body,
      images,
      video,
      coverImage,
    };

    // Remove the image management fields from updateData to avoid saving them to the property
    delete updateData.imagesToDelete;
    delete updateData.imageOrder;

    const property = await Property.findByIdAndUpdate(id, updateData, { new: true })
      .populate('category', 'name')
      .populate('subcategory', 'name')
      .populate('amenities', 'label image');

    res.json(property);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

// Delete property with images and video cleanup
const deleteProperty: RequestHandler = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      res.status(404).json({ error: 'Property not found' });
      return;
    }

    // Delete associated files
    const filesToDelete: string[] = [];

    if (property.images && property.images.length > 0) {
      filesToDelete.push(...property.images);
    }

    // No video file deletion needed, video is now a string

    if (filesToDelete.length > 0) {
      try {
        await imageUploader.deleteFiles(filesToDelete);
      } catch (fileError) {
        console.warn('Failed to delete some files:', fileError);
      }
    }

    // Delete the property from database
    await Property.findByIdAndDelete(req.params.id);

    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

const getPropertyByHostId: RequestHandler = async (req, res) => {
  try {
    const userID = req.params.id;

    const properties = await Property.find({ host: userID })
      .populate('category', 'name')
      .populate('subcategory', 'name')
      .populate('amenities', 'label image');

    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
const allowedStatuses = ['IN_PROGRESS', 'PUBLISHED', 'SOLD', 'RENTED', 'DRAFT', 'REJECTED'];

const updatePropertyPublishStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!allowedStatuses.includes(status)) {
      res.status(400).json({ error: 'Invalid status value' });
      return;
    }
    const property = await Property.findByIdAndUpdate(id, { publishStatus: status }, { new: true });
    if (!property) {
      res.status(404).json({ error: 'Property not found' });
      return;
    }
    res.json(property);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

const updatePropertyFeaturedStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isFeatured } = req.body;

    if (typeof isFeatured !== 'boolean') {
      res.status(400).json({ error: 'isFeatured must be a boolean value' });
      return;
    }

    const property = await Property.findById(id);
    if (!property) {
      res.status(404).json({ error: 'Property not found' });
      return;
    }

    // If enabling featured, enforce global and per-category limits
    if (isFeatured) {
      // If already featured, return as-is (idempotent)
      if (property.isFeatured) {
        res.json(property);
        return;
      }

      // Global limit: maximum 9 featured properties
      const featuredCount = await Property.countDocuments({ isFeatured: true });
      if (featuredCount >= 9) {
        res.status(400).json({ error: 'Maximum of 9 featured properties allowed' });
        return;
      }

      // Determine target category: prefer category from request (if provided), otherwise existing property.category
      let targetCategory: any = typeof req.body.category !== 'undefined' && req.body.category !== null
        ? req.body.category
        : property.category;

      // Per-category limit: maximum 3 featured properties per category
      if (targetCategory) {
        // Normalize category id (handle populated object, ObjectId or string)
        let categoryObj: any = targetCategory;
        if (typeof categoryObj === 'object' && (categoryObj as any)._id) {
          categoryObj = (categoryObj as any)._id;
        }

        try {
          // If valid ObjectId string, convert to ObjectId; otherwise use string
          if (Types.ObjectId.isValid(String(categoryObj))) {
            categoryObj = new Types.ObjectId(String(categoryObj));
          } else {
            categoryObj = String(categoryObj);
          }
        } catch (e) {
          categoryObj = String(categoryObj);
        }

        // Exclude the current property from the count to avoid self-counting
        const featuredInCategory = await Property.countDocuments({
          isFeatured: true,
          category: categoryObj,
          _id: { $ne: property._id },
        });

        if (featuredInCategory >= 3) {
          res.status(400).json({ error: 'Maximum of 3 featured properties allowed per category' });
          return;
        }
      }
    }

    const updated = await Property.findByIdAndUpdate(id, { isFeatured }, { new: true })
      .populate('category', 'name')
      .populate('subcategory', 'name')
      .populate('amenities', 'label image');

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};


// const updatePropertyFeaturedStatus = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const { isFeatured } = req.body;

//     if (typeof isFeatured !== 'boolean') {
//       res.status(400).json({ error: 'isFeatured must be a boolean value' });
//       return;
//     }

//     const property = await Property.findById(id);
//     if (!property) {
//       res.status(404).json({ error: 'Property not found' });
//       return;
//     }

//     // If enabling featured, enforce global and per-category limits
//     if (isFeatured) {
//       // If already featured, return as-is (idempotent)
//       if (property.isFeatured) {
//         res.json(property);
//         return;
//       }

//       // Global limit: maximum 9 featured properties
//       const featuredCount = await Property.countDocuments({ isFeatured: true });
//       if (featuredCount >= 9) {
//         res.status(400).json({ error: 'Maximum of 9 featured properties allowed' });
//         return;
//       }

//       // Per-category limit: maximum 3 featured properties per category
//       // Only apply this constraint when the property has a category
//       let categoryId: any = property.category;
//       if (categoryId) {
//         // Ensure we use an ObjectId for the query so it matches stored values
//         let categoryObj: any = categoryId;
//         // If category is a populated object, get its _id
//         if (typeof categoryObj === 'object' && (categoryObj as any)._id) {
//           categoryObj = (categoryObj as any)._id;
//         }

//         // Convert to Types.ObjectId if possible
//         try {
//           if (!Types.ObjectId.isValid(categoryObj)) {
//             // fallback: stringify
//             categoryObj = String(categoryObj);
//           } else {
//             categoryObj = new Types.ObjectId(categoryObj);
//           }
//         } catch (e) {
//           categoryObj = String(categoryObj);
//         }

//         // Exclude the current property from the count to avoid self-counting
//         const featuredInCategory = await Property.countDocuments({ isFeatured: true, category: categoryObj, _id: { $ne: property._id } });
//         if (featuredInCategory >= 3) {
//           res.status(400).json({ error: 'Maximum of 3 featured properties allowed per category' });
//           return;
//         }
//       }
//     }

//     const updated = await Property.findByIdAndUpdate(id, { isFeatured }, { new: true })
//       .populate('category', 'name')
//       .populate('subcategory', 'name')
//       .populate('amenities', 'label image');

//     res.json(updated);
//   } catch (error) {
//     res.status(500).json({ error: (error as Error).message });
//   }
// };

const getFeaturedProperties = async (req: Request, res: Response) => {
  try {
    const rawPerCategory = parseInt(String(req.query.perCategoryLimit ?? '3'), 10);
    const rawOverall = parseInt(String(req.query.limit ?? '9'), 10);

    const perCategoryLimit = Number.isFinite(rawPerCategory) && rawPerCategory > 0
      ? Math.min(rawPerCategory, 50)
      : 3;

    const overallLimit = Number.isFinite(rawOverall) && rawOverall > 0
      ? Math.min(rawOverall, 200)
      : 9;

    // Fetch featured properties ordered by category then by createdAt (newest first)
    // Sorting by 'category' groups same-category docs together; createdAt keeps newest first inside a category.
    const featuredAll = await Property.find({ isFeatured: true })
      .populate('category', 'name')
      .populate('subcategory', 'name')
      .populate('amenities', 'label image')
      .populate('host', 'name email')
      .sort({ category: 1, createdAt: -1 })
      .lean();

    // Group in encountered order and respect perCategoryLimit
    const groups = new Map<string, { category: any; properties: any[] }>();
    for (const prop of featuredAll) {
      const cat = prop.category || { _id: 'uncategorized', name: 'Uncategorized' };
      const catId = String(cat._id);
      if (!groups.has(catId)) {
        groups.set(catId, { category: cat, properties: [] });
      }
      const entry = groups.get(catId)!;
      if (entry.properties.length < perCategoryLimit) {
        entry.properties.push(prop);
      }
    }

    // Build flat list in category-block order up to overallLimit
    const propertiesFlat: any[] = [];
    const propertiesByCategory: any[] = [];
    for (const [, entry] of groups) {
      if (propertiesFlat.length >= overallLimit) break;
      const remainingSlots = overallLimit - propertiesFlat.length;
      const take = Math.min(entry.properties.length, remainingSlots);
      const slice = entry.properties.slice(0, take);
      propertiesByCategory.push({ category: entry.category, properties: slice });
      propertiesFlat.push(...slice);
    }

    res.json({
      totalFeatured: featuredAll.length,
      perCategoryLimit,
      overallLimit,
      propertiesByCategory,
      // properties: propertiesFlat,
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export {
  createProperty,
  getAllProperties,
  getPropertyById,
  getPropertyByHostId,
  getPropertyBySlug,
  updateProperty,
  deleteProperty,
  uploadPropertyImages,
  updatePropertyPublishStatus,
  getFeaturedProperties,
  updatePropertyFeaturedStatus
};
