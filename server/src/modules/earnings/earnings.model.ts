import mongoose, { Schema, Document } from 'mongoose';
import { IProperty } from '../properties/property.types';
import { IUser } from '../user/user.interfaces';

export interface IEarningsDocument extends Document {
  property: mongoose.Types.ObjectId | IProperty;
  revenue: number;
  cost: number;
  profit: number;
  profitMargin: number;
  transactionDate: Date;
  bookingReference?: mongoose.Types.ObjectId;
  paymentStatus: 'PENDING' | 'COMPLETED' | 'PARTIAL' | 'FAILED';
  createdAt: Date;
  updatedAt: Date;
  commissionType: 'flat' | 'percentage';
  image: string;
  commission: number;
}

const earningsSchema = new Schema<IEarningsDocument>(
  {
    property: {
      type: Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    revenue: {
      type: Number,
      required: true,
      min: 0,
    },
    cost: {
      type: Number,
      required: true,
      min: 0,
    },
    profit: {
      type: Number,
      required: true,
    },
    profitMargin: {
      type: Number,
      required: true,
      min: 0,
    },
    commissionType: {
      type: String,
      enum: ['flat', 'percentage'],
      default: 'percentage',
    },
    commission: {
      type: Number,
      required: false,
      default: 0,
    },
    image: {
      type: String,
      required: false,
    },
    transactionDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    bookingReference: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
    },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'COMPLETED', 'PARTIAL', 'FAILED'],
      default: 'PENDING',
    },
  },
  {
    timestamps: true,
  }
);

// Simple pre-save hook to calculate profit
earningsSchema.pre('save', function (next) {
  if (this.isModified('revenue') || this.isModified('cost')) {
    this.profit = this.revenue - this.cost;
  }
  next();
});

// Essential indexes for filtering
earningsSchema.index({ transactionDate: 1 });
earningsSchema.index({ host: 1 });

const Earnings = mongoose.model<IEarningsDocument>('Earnings', earningsSchema);
export default Earnings;
