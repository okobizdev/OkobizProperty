import { Types, Document } from 'mongoose';

export interface IFilterField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'boolean' | 'date' | 'select' | 'multiselect' | 'measurement' | 'range';
  options?: string[];
  isRequired?: boolean;
  displayOrder?: number;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
  placeholder?: string;
  helpText?: string;
  supportedUnits?: string[];
  defaultUnit?: string;
}

export interface IFilterConfig extends Document {
  subcategory: Types.ObjectId;
  fields: IFilterField[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
