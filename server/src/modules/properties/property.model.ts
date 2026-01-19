import { Schema, model, Types, Model } from 'mongoose';
import { IProperty } from './property.types';

const PropertySchema = new Schema<IProperty>(
  {
    title: { type: String, required: true },
    description: { type: String, default: null },
    location: { type: String, default: null },
    price: { type: Number, default: null },
    priceUnit: { type: String, default: 'BDT' }, // Currency unit for price
    size: { type: Number, default: null },
    sizeUnit: { type: String, default: 'sqft' },

    numberOfRooms: { type: Number, default: null },
    numberOfWashrooms: { type: Number, default: null },
    numberOfBalconies: { type: Number, default: null },
    numberOfBedrooms: { type: Number, default: null },
    numberOfGuests: { type: Number, default: null },
    airConditioning: { type: Boolean, default: false },
    bedType: { type: String, default: null },
    images: { type: [String], default: [] },
    video: { type: String, default: null },
    coverImage: { type: String, default: null },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    subcategory: { type: Schema.Types.ObjectId, ref: 'Subcategory', required: true },
    listingType: { type: String, enum: ['RENT', 'SELL'], required: true },
    duration: { type: String, default: null }, // Duration for rent
    rentDurationType: { type: String, enum: ['MONTHLY', 'YEARLY', 'SIX_MONTHS', 'DAILY', 'WEEKLY', 'HOURLY', 'FLEXIBLE'], default: null },
    startingDate: { type: Date, default: null },
    amenities: [{ type: Schema.Types.ObjectId, ref: 'Amenity', default: [] }],
    host: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    publishStatus: {
      type: String,
      enum: ['IN_PROGRESS', 'PUBLISHED', 'SOLD', 'RENTED', 'DRAFT', 'REJECTED'],
      default: 'IN_PROGRESS',
    },
    slug: {
      type: String,
      index: {
        unique: true,
        partialFilterExpression: { slug: { $type: 'string' } },
      },
    },
    smokingAllowed: { type: Boolean, default: false },
    isSold: { type: Boolean, default: false },
    checkinDate: { type: Date, default: null },
    checkoutDate: { type: Date, default: null },
    adultCount: { type: Number, default: 0 },
    childrenCount: { type: Number, default: 0 },
    blockedDates: { type: [Date], default: [] }, // Dates when the property is blocked for bookings
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Pre-save hook to generate slug
PropertySchema.pre('save', async function (next) {
  const doc = this as unknown as IProperty;
  if (doc.isModified('title') || doc.isNew) {
    doc.slug = doc.title?.trim().toLowerCase().replace(/\s+/g, '-') || `property-${Date.now()}`;
  }
  next();
});

const Property: Model<IProperty> = model<IProperty>('Property', PropertySchema);

export default Property;
