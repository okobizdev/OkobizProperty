// import Booking from './bookings.model';
// import { Bookings } from './bookings.type';
// import { Request, Response, NextFunction, RequestHandler } from 'express';
// import { processPayment } from '../payment/payment.controller';
// import { exitOnError } from 'winston';
// import mailTransporter from '../../configs/nodemailer.configs';
// import { env } from '../../env';

// export const getAllBookings: RequestHandler = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     let { listingType, page = 1, limit = 10 } = req.query;
//     let listingTypes: string[] = [];

//     if (listingType) {
//       if (Array.isArray(listingType)) {
//         listingTypes = listingType as string[];
//       } else if (typeof listingType === 'string') {
//         listingTypes = (listingType as string).split(',');
//       }
//     } else {
//       listingTypes = ['SELL', 'RENT'];
//     }

//     page = Number(page);
//     limit = Number(limit);

//     const bookings = await Booking.find()
//       .populate('userId')
//       .populate({
//         path: 'propertyId',
//         match: { listingType: { $in: listingTypes } },
//         populate: {
//           path: 'host',
//           model: 'User',
//         },
//       })
//       .skip((page - 1) * limit)
//       .limit(limit)
//       .sort({ createdAt: -1 });

//     const totalBookings = await Booking.countDocuments();

//     const filteredBookings = bookings.filter((b) => b.propertyId);

//     res.status(200).json({
//       success: true,
//       total: totalBookings,
//       data: filteredBookings,
//       pagination: {
//         currentPage: page,
//         totalPages: Math.ceil(totalBookings / limit),
//         totalItems: totalBookings,
//         hasNext: page * limit < totalBookings,
//         hasPrev: page > 1,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, total: 0, message: 'Error fetching bookings' });
//     next();
//   }
// };

// export const getBookingById: RequestHandler = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const bookingId: string = req.params.id;
//     const booking: Bookings | null = await Booking.findById(bookingId);
//     if (!booking) {
//       res.status(404).json({ success: false, message: 'Booking not found' });
//       return;
//     }
//     res.status(200).json({ success: true, data: booking });
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Error fetching booking' });
//   }
// };

// export const createBooking: RequestHandler = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { userId, propertyId, paymentMethod, appointmentRequestedDate, appointmentDate } =
//       req.body;
//     console.log('Creating booking with data:', req.body);

//     // Basic validation
//     if (!userId || !propertyId || !paymentMethod) {
//       res
//         .status(400)
//         .json({ success: false, message: 'userId, propertyId, and paymentMethod are required' });
//       return;
//     }
//     const existingBooking = await Booking.findOne({ userId, propertyId });

//     if (existingBooking) {
//       res
//         .status(409)
//         .json({ success: false, message: 'You already have an appointment for this property' });
//       return;
//     }

//     let paymentStatus = 'unpaid';
//     let paymentId = null;

//     // Handle payment based on the method
//     if (paymentMethod === 'cash_on_delivery') {
//       // Cash on Delivery: No payment processing needed
//       paymentStatus = 'unpaid';
//     } else if (paymentMethod === 'SSL' || paymentMethod === 'bKash') {
//       // Process online payment
//       const paymentResult = await processPayment(req.body); // Replace with actual payment logic
//       if (!paymentResult.success) {
//         res.status(400).json({ success: false, message: 'Payment failed' });
//         return;
//       }
//       paymentStatus = 'paid';
//       paymentId = paymentResult.id;
//     } else {
//       res.status(400).json({ success: false, message: 'Invalid payment method' });
//       return;
//     }

//     const newBooking = new Booking({
//       userId,
//       propertyId,
//       checkInDate: req.body.checkInDate ?? null,
//       checkOutDate: req.body.checkOutDate ?? null,
//       status: 'pending',
//       paymentMethod,
//       paymentStatus,
//       paymentId,
//       appointmentRequestedDate: appointmentRequestedDate ?? null,
//       appointmentDate: appointmentDate ?? null,
//     });

//     await newBooking.save();
//     res.status(201).json({ success: true, data: newBooking });
//   } catch (error) {
//     console.error('Error creating booking:', error);
//     res.status(500).json({ success: false, message: 'Error creating booking' });
//   }
// };

// export const deleteBooking: RequestHandler = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const bookingId: string = req.params.id;
//     const deleted = await Booking.findByIdAndDelete(bookingId);
//     if (!deleted) {
//       res.status(404).json({ success: false, message: 'Booking not found' });
//       return;
//     }
//     res.status(200).json({ success: true, message: 'Booking deleted' });
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Error deleting booking' });
//   }
// };

// export const getBookingByPropertyId: RequestHandler = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const propertyId = req.params.id;
//     let { page = 1, limit = 10 } = req.query;

//     page = Number(page);
//     limit = Number(limit);

//     const bookings = await Booking.find({ propertyId })
//       .populate('userId')
//       .populate({
//         path: 'propertyId',
//         populate: {
//           path: 'host',
//           model: 'User',
//         },
//       })
//       .skip((page - 1) * limit)
//       .limit(limit);

//     const totalBookings = await Booking.countDocuments({ propertyId });

//     res.status(200).json({
//       success: true,
//       data: bookings,
//       pagination: {
//         currentPage: page,
//         totalPages: Math.ceil(totalBookings / limit),
//         totalItems: totalBookings,
//         hasNext: page * limit < totalBookings,
//         hasPrev: page > 1,
//       },
//     });
//   } catch (error) {
//     console.log('Error fetching bookings:', error);
//     res.status(500).json({ success: false, message: 'Error fetching bookings' });
//   }
// };

// export const getBookingByHostId: RequestHandler = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const hostId = req.params.id;
//     let { page = 1, limit = 10 } = req.query;

//     page = Number(page);
//     limit = Number(limit);

//     const bookings = await Booking.find({ userId: { $ne: null } })
//       .populate({
//         path: 'propertyId',
//         populate: {
//           path: 'host',
//           model: 'User',
//         },
//       })
//       .populate('userId')
//       .skip((page - 1) * limit)
//       .limit(limit);

//     const totalBookings = await Booking.countDocuments({ userId: { $ne: null } });

//     const filteredBookings = bookings.filter((booking) => {
//       const property: any = booking.propertyId;
//       if (property && typeof property === 'object' && 'host' in property && property.host) {
//         const host: any = property.host;
//         return host._id.toString() === hostId;
//       }
//       return false;
//     });

//     res.status(200).json({
//       success: true,
//       data: filteredBookings,
//       pagination: {
//         currentPage: page,
//         totalPages: Math.ceil(filteredBookings.length / limit),
//         totalItems: filteredBookings.length,
//         hasNext: page * limit < filteredBookings.length,
//         hasPrev: page > 1,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Error fetching bookings' });
//   }
// };

// export const getBookingByUserId: RequestHandler = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const userId = req.params.id;
//     let { page = 1, limit = 10 } = req.query;

//     page = Number(page);
//     limit = Number(limit);

//     const bookings = await Booking.find({ userId })
//       .populate('userId')
//       .populate({
//         path: 'propertyId',
//         select: '-host',
//       })
//       .sort({ createdAt: -1 })
//       .skip((page - 1) * limit)
//       .limit(limit);

//     const totalBookings = await Booking.countDocuments({ userId });

//     res.status(200).json({
//       success: true,
//       data: bookings,
//       pagination: {
//         currentPage: page,
//         totalPages: Math.ceil(totalBookings / limit),
//         totalItems: totalBookings,
//         hasNext: page * limit < totalBookings,
//         hasPrev: page > 1,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Error fetching bookings' });
//   }
// };

// export const updateBookingStatus: RequestHandler = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const bookingId = req.params.id;
//     const { status, appointmentDate } = req.body;

//     // Get the booking before updating to check if status changed
//     const existingBooking = await Booking.findById(bookingId)
//       .populate('userId')
//       .populate({
//         path: 'propertyId',
//         populate: {
//           path: 'host',
//           model: 'User',
//         },
//       });

//     if (!existingBooking) {
//       res.status(404).json({ success: false, message: 'Booking not found' });
//       return;
//     }

//     const oldStatus = existingBooking.status;

//     const updatedBooking = await Booking.findByIdAndUpdate(
//       bookingId,
//       { status, appointmentDate },
//       { new: true }
//     )
//       .populate('userId');

//     if (!updatedBooking) {
//       res.status(404).json({ success: false, message: 'Booking not found' });
//       return;
//     }

//     // Send email if status changed
//     if (oldStatus !== status) {
//       try {
//         const user = updatedBooking.userId as any;
//         const property = updatedBooking.propertyId as any;
//         const host = property?.host as any;

//         const emailSubject = `Booking Status Update - ${property?.title || 'Property'}`;
//         const emailText = `
// Dear ${user?.name || 'Valued Customer'},

// Your booking status has been updated.

// Booking Details:
// - Property: ${property?.title || 'N/A'}
// - Location: ${property?.location || 'N/A'}
// - Status: ${status}
// - Booking Date: ${
//           updatedBooking.createdAt ? new Date(updatedBooking.createdAt).toLocaleDateString() : 'N/A'
//         }
// ${appointmentDate ? `- Appointment Date: ${new Date(appointmentDate).toLocaleDateString()}` : ''}

// Best regards,
// ${env.ADMIN_NAME || 'Property Management Team'}
//         `.trim();

//         await mailTransporter.sendMail({
//           from: env.SMTP_USER,
//           to: user?.email,
//           subject: emailSubject,
//           text: emailText,
//         });

//         console.log(`Status update email sent to ${user?.email}`);
//       } catch (emailError) {
//         console.error('Error sending status update email:', emailError);
//         // Don't fail the request if email fails
//       }
//     }

//     res.status(200).json({ success: true, data: updatedBooking });
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Error updating booking status' });
//   }
// };
