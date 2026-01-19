import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true },
    method: { type: String, enum: ['cash_on_delivery', 'SSL', 'BKash', 'manualPayment'], required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    tran_id: { type: String, default: null },
    val_id : { type: String, default: null },
    paymentDate: { type: Date, default: Date.now },
    paymentProof: { type: String, default: null }, // URL or path to the payment proof document/image
    details: { type: mongoose.Schema.Types.Mixed, default: {} }, // To store any additional payment details
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
