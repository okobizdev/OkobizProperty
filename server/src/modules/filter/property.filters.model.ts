import { Schema, model, Model, Types } from 'mongoose';
import { IFilterConfig, IFilterField } from './property.filters.types'; // <-- Import types

const FilterFieldSchema = new Schema<IFilterField>(
  {
    name: { type: String, required: true },
    label: { type: String, required: true },
    type: {
      type: String,
      enum: ['text', 'number', 'boolean', 'date', 'select', 'multiselect', 'measurement', 'range'],
      required: true,
    },
    options: [{ type: String }],
    isRequired: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0 },
    validation: {
      min: { type: Number },
      max: { type: Number },
      pattern: { type: String },
    },
    placeholder: { type: String },
    helpText: { type: String },
    supportedUnits: [{ type: String }],
    defaultUnit: { type: String },
  },
  { _id: false }
);

const FilterConfigSchema = new Schema<IFilterConfig>(
  {
    subcategory: { type: Schema.Types.ObjectId, ref: 'Subcategory', required: true, unique: true },
    fields: [FilterFieldSchema],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const FilterConfig: Model<IFilterConfig> = model<IFilterConfig>('FilterConfig', FilterConfigSchema);

export default FilterConfig;
