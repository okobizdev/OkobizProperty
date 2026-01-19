import { Schema, model, Model } from 'mongoose';
import { ISubcategory } from './subcategories.types';

const SubcategorySchema = new Schema<ISubcategory>(
  {
    name: { type: String, required: true, trim: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    description: { type: String, default: null },
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
    // Business rules for this subcategory
    allowedListingTypes: [{ type: String, enum: ['RENT', 'SELL', 'LEASE'], default: ['RENT', 'SELL', 'LEASE'] }],
    requiresDateRange: { type: Boolean, default: false },
    requiresGuestCount: { type: Boolean, default: false },
    image: { type: String, default: null },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound unique index for name+category
SubcategorySchema.index({ name: 1, category: 1 }, { unique: true });

// Virtuals for filterConfig and amenitiesConfig (for future extensibility)
SubcategorySchema.virtual('filterConfig', {
  ref: 'FilterConfig',
  localField: '_id',
  foreignField: 'subcategory',
  justOne: true,
});

SubcategorySchema.virtual('amenitiesConfig', {
  ref: 'AmenitiesConfig',
  localField: '_id',
  foreignField: 'subcategory',
  justOne: true,
});

const Subcategory: Model<ISubcategory> = model<ISubcategory>('Subcategory', SubcategorySchema);
export default Subcategory;
