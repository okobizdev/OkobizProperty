import { Schema, model, Model } from 'mongoose';

const CategorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, default: null },
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
    image: { type: String, default: null },
    listingType: { type: String, enum: ["sell", "rent"], default: "sell" },
  },
  { timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Add virtual field for subcategories
CategorySchema.virtual('subcategories', {
  ref: 'Subcategory',
  localField: '_id',
  foreignField: 'category',
  justOne: false, // A category can have multiple subcategories
});

const Category: Model<any> = model('Category', CategorySchema);
export default Category;
