import paymentModel from './payment.model';
import { Request } from 'express';
import { saveUploadedFile } from './imageUploader';

const processPayment = {
  cashPayment: async (amount: number) => {
    return { success: true, paymentId: null };
  },

  sslPayment: async (amount: number) => {
    return { success: true, paymentId: 'SSL123456' };
  },

  bkashPayment: async (amount: number) => {
    return { success: true, paymentId: 'BKASH123456' };
  },

  manualPayment: async (req: Request, totalAmount: number) => {
    try {
      const { tran_id, paymentMethod, details } = req.body;

      // Check if files exist in request
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      // Check for payment proof file
      if (!files?.paymentProof?.[0]) {
        console.log('No payment proof file in request');
        return { success: false, error: 'Payment proof file is required' };
      }

      // Save uploaded file
      let paymentProof: string | null = null;
      const uploadResult = await saveUploadedFile(files.paymentProof[0], 'bookings/paymentProof');

      if (!uploadResult.success) {
        console.log('File upload failed:', uploadResult.error);
        return { success: false, error: uploadResult.error || 'Failed to save payment proof' };
      }

      paymentProof = uploadResult.url!;
      console.log('File saved successfully at:', paymentProof);

      // Save payment record
      const payment = await paymentModel.create({
        amount: totalAmount,
        method: paymentMethod,
        status: 'pending',
        tran_id,
        val_id: null,
        paymentDate: Date.now(),
        paymentProof,
        details,
      });

      return { success: true, payment: payment, paymentId: payment._id };
    } catch (err) {
      console.error('Manual payment error:', err);
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Manual payment failed',
      };
    }
  },
};

export { processPayment };
