// types.ts
import { IUser } from '../user/user.interfaces';
import { IProperty } from '../properties/property.types';

export interface Client {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  note?: string;
}

export interface Bookings {
  _id: string;
  userId: string | IUser | null; // Can be ObjectId or populated user or null
  client?: Client; // For guest bookings
  propertyId: string | IProperty; // Can be ObjectId or populated property
  checkInDate?: Date | null;
  checkOutDate?: Date | null;
  status: 'pending' | 'confirmed' | 'cancelled';
  appointmentRequestedDate?: Date | null;
  appointmentDate?: Date | null;
  paymentMethod: 'credit_card' | 'paypal' | 'bank_transfer' | 'Cash_Payment';
  paymentStatus: 'unpaid' | 'paid' | 'refunded';
  paymentId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  agentName?: string | null;
  agentPhone?: string | null;
}
