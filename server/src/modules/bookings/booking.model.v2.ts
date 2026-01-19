import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User',  default: null },
    client : {
        name: { type: String, default: null },
        email: { type: String, default: null },
        phone: { type: String, default: null },
        address: { type: String, default: null },
        note: { type: String, default: null },
        numberOfGuests: { type: Number, default: null },
        nid: { type: String, default: null },
        numberOfAdults: { type: Number, default: null },
        numberOfChildren: { type: Number, default: null },
        guests: [
          { type: String }
      ],
        purposeOfLiving: { type: String, default: null },
    },
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    checkInDate: { type: Date, default: null },
    checkOutDate: { type: Date, default: null },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
    appointmentRequestedDate: { type: Date, default: null },
    appointmentDate: { type: Date, default: null },
    paymentMethod: {
      type: String,
      enum: ['credit_card', 'paypal', 'bank_transfer', 'Cash_Payment', 'manualPayment'],
      default: 'Cash_Payment',
    },
    paymentStatus: { type: String, enum: ['unpaid', 'paid', 'refunded', 'pending'], default: 'unpaid' },
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment', required : false },
    agentName: { type: String, default: null },
    agentPhone: { type: String, default: null },
    totalAmount: { type: Number, default: 0 },
    numberOfGuests: { type: Number, default: null },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
