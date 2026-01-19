// import mongoose from 'mongoose';

// const bookingSchema = new mongoose.Schema(
//   {
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
//     checkInDate: { type: Date, default: null },
//     checkOutDate: { type: Date, default: null },
//     status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
//     appointmentRequestedDate: { type: Date, default: null },
//     appointmentDate: { type: Date, default: null },
//     paymentMethod: {
//       type: String,
//       enum: ['credit_card', 'paypal', 'bank_transfer', 'cash_on_delivery'],
//       default: 'cash_on_delivery',
//     },
//     paymentStatus: { type: String, enum: ['unpaid', 'paid', 'refunded'], default: 'unpaid' },
//     paymentId: { type: String, default: null },
//   },
//   {
//     timestamps: true, // Automatically adds createdAt and updatedAt fields
//   }
// );

// const Booking = mongoose.model('Booking', bookingSchema);

// export default Booking;
