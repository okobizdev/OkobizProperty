import Booking from './booking.model.v2';
import User from '../user/user.model';
import { Bookings } from './bookings.type';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import mailTransporter from '../../configs/nodemailer.configs';
import { env } from '../../env';
import Property from '../properties/property.model';
import { processPayment } from '../payment/booking.payment.repository';
import { saveNIDFile } from '../../utils/nidUploader';
import sendBookingConfirmMail from '../../utils/bookingNotification';

export const getAllBookings: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let { listingType, page = 1, limit = 10 } = req.query;
    let listingTypes: string[] = [];

    if (listingType) {
      if (Array.isArray(listingType)) {
        listingTypes = listingType as string[];
      } else if (typeof listingType === 'string') {
        listingTypes = (listingType as string).split(',');
      }
    } else {
      listingTypes = ['SELL', 'RENT'];
    }

    page = Number(page);
    limit = Number(limit);

    const bookings = await Booking.find()
      .populate('userId')
      .populate({
        path: 'propertyId',
        match: { listingType: { $in: listingTypes } },
        populate: [
          {
            path: 'host',
            model: 'User',
          },
          {
            path: 'category',
            model: 'Category',
          },
          {
            path: 'subcategory',
            model: 'Subcategory',
          },
        ],
      })
      .populate('paymentId')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalBookings = await Booking.countDocuments();

    const filteredBookings = bookings.filter((b) => b.propertyId);

    res.status(200).json({
      success: true,
      total: totalBookings,
      data: filteredBookings,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalBookings / limit),
        totalItems: totalBookings,
        hasNext: page * limit < totalBookings,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, total: 0, message: 'Error fetching bookings' });
    next();
  }
};

export const getBookingById: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bookingId: string = req.params.id;
    const booking: Bookings | null = await Booking.findById(bookingId);
    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found' });
      return;
    }
    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching booking' });
  }
};

export const createBooking: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      userId,
      client,
      propertyId,
      paymentMethod,
      appointmentRequestedDate,
      appointmentDate,
      note,
    } = req.body;

    // Parse client data with proper error handling
    let parsedClient = null;
    if (client) {
      if (typeof client === 'string') {
        try {
          parsedClient = JSON.parse(client);
        } catch (e) {
          res.status(400).json({ success: false, message: 'Invalid client data format' });
          return;
        }
      } else {
        parsedClient = client;
      }
    }

    // Extract client information safely
    const clientName = parsedClient?.name || null;
    const clientAddress = parsedClient?.address || null;
    const numberOfGuests = parsedClient?.numberOfGuests || null;
    const clientPhone = parsedClient?.phone || null;

    // Basic validation
    if (!propertyId || !paymentMethod) {
      res
        .status(400)
        .json({ success: false, message: 'propertyId and paymentMethod are required' });
      return;
    }

    let clientData = null;
    let userIdToUse = null;

  // check if userId is provided and existing booking for non flexible rent duration type

    if (userId) {
      // Fetch user data and populate client
      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }
      userIdToUse = userId;

      const existingBooking = await Booking.findOne({ userId: userIdToUse, propertyId }).populate(
        'propertyId'
      );
      //listing type is non flexible 
      if (
        existingBooking &&
        typeof existingBooking.propertyId === 'object' &&
        existingBooking.propertyId !== null &&
        'rentDurationType' in existingBooking.propertyId &&
        (existingBooking.propertyId as any).rentDurationType !== 'FLEXIBLE'
      ) {
        res
          .status(409)
          .json({ success: false, message: 'You already have an appointment for this property' });
        return;
      }
    } else {
      // Use provided client data - validate required fields
      console.log('client data:', client);
      if (!clientName || !clientPhone || !clientAddress) {
        res.status(400).json({
          success: false,
          message: 'Client name, phone, and address are required when userId is not provided',
        });
        return;
      }
    }

    console.log('Parsed client data:', parsedClient);

    // Process NID file if uploaded
    if (req.files && (req.files as any).nid && (req.files as any).nid[0]) {
      const nidFile = (req.files as any).nid[0];
      try {
        const nidPath = await saveNIDFile(nidFile.buffer, nidFile.originalname);
        clientData = {
          ...parsedClient,
          nid: nidPath,
        };
        console.log('clientData with NID:', clientData);
      } catch (error) {
        console.error('Error saving NID file:', error);
        res.status(500).json({ success: false, message: 'Failed to save NID file' });
        return;
      }
    } else {
      clientData = {
        ...parsedClient,
        nid: null,
      };
    }

    let paymentStatus = 'unpaid';
    let paymentId = null;
    let totalAmount;
    let paymentResult = null;
    let property = null
    if (propertyId) {
      property = await Property.findById(propertyId);
      if (property && property.listingType === 'RENT' && property.rentDurationType == 'FLEXIBLE') {
        const numberOfDays = Math.ceil(
          (new Date(req.body.checkOutDate).getTime() - new Date(req.body.checkInDate).getTime()) /
            (1000 * 3600 * 24)
        );
        totalAmount = property.price * numberOfDays;
      } else {
        totalAmount = property?.price || 0;
      }
      
      // Handle payment based on the method
      if (paymentMethod === 'Cash_Payment') {
        // Cash on Delivery: No payment processing needed
        paymentStatus = 'unpaid';
      } else if (paymentMethod === 'manualPayment') {
        paymentResult = await processPayment.manualPayment(req, totalAmount);

        if (!paymentResult.success) {
          res
            .status(400)
            .json({ success: false, message: paymentResult.error || 'Payment failed' });
          return;
        }

        paymentStatus = 'pending';
        paymentId = paymentResult.paymentId;
      } else {
        res.status(400).json({ success: false, message: 'Invalid payment method' });
        return;
      }
    }

    const newBooking = new Booking({
      userId: userIdToUse,
      client: clientData,
      propertyId,
      checkInDate: req.body.checkInDate ?? null,
      checkOutDate: req.body.checkOutDate ?? null,
      status: 'pending',
      paymentMethod,
      paymentStatus,
      paymentId,
      appointmentRequestedDate: appointmentRequestedDate ?? null,
      appointmentDate: appointmentDate ?? null,
      totalAmount,
      numberOfGuests: numberOfGuests || null,
    });

    await newBooking.save();

    await sendBookingConfirmMail({
      email: clientData.email,
      name: clientData.name,
      phone: clientData.phone,
      address: clientData.address,
      note: clientData.note || "N/A",
      bookingId: newBooking._id.toString(),
      property: {
        name: property?.title || "not defined",
      },
      checkInDate: req.body.checkInDate || "N/A",
      checkOutDate: req.body.checkOutDate || "N/A",
      numberOfGuests: numberOfGuests || "N/A",
      appointmentRequestedDate: appointmentRequestedDate || "N/A",
      appointmentDate: appointmentDate || "N/A",
      paymentMethod: paymentMethod || "N/A",
      paymentStatus: paymentStatus || "Pending",
      totalAmount: totalAmount || "not defined",
      status: newBooking.status || "Pending",
    });

    res.status(201).json({ success: true, data: newBooking, paymentResult: paymentResult || null });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ success: false, message: 'Error creating booking' });
  }
};
export const deleteBooking: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bookingId: string = req.params.id;
    const deleted = await Booking.findByIdAndDelete(bookingId);
    if (!deleted) {
      res.status(404).json({ success: false, message: 'Booking not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Booking deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting booking' });
  }
};

export const getBookingByPropertyId: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const propertyId = req.params.id;
    let { page = 1, limit = 10 } = req.query;

    page = Number(page);
    limit = Number(limit);

    const bookings = await Booking.find({ propertyId })
      .populate('userId')
      .populate({
        path: 'propertyId',
        populate: {
          path: 'host',
          model: 'User',
        },
      })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalBookings = await Booking.countDocuments({ propertyId });

    res.status(200).json({
      success: true,
      data: bookings,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalBookings / limit),
        totalItems: totalBookings,
        hasNext: page * limit < totalBookings,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching bookings' });
  }
};

export const getBookingByHostId: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const hostId = req.params.id;
    let { page = 1, limit = 10 } = req.query;

    page = Number(page);
    limit = Number(limit);

    const bookings = await Booking.find()
      .populate({
        path: 'propertyId',
        populate: {
          path: 'host',
          model: 'User',
        },
      })
      .populate('userId');

    const filteredBookings = bookings.filter((booking) => {
      const property: any = booking.propertyId;
      if (property && typeof property === 'object' && 'host' in property && property.host) {
        const host: any = property.host;
        return host._id.toString() === hostId;
      }
      return false;
    });

    const totalItems = filteredBookings.length;
    const paginatedBookings = filteredBookings.slice((page - 1) * limit, page * limit);

    res.status(200).json({
      success: true,
      data: paginatedBookings,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        totalItems: totalItems,
        hasNext: page * limit < totalItems,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching bookings' });
  }
};

export const getBookingByUserId: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.id;
    let { page = 1, limit = 10 } = req.query;

    page = Number(page);
    limit = Number(limit);

    const bookings = await Booking.find({ userId })
      .populate('userId')
      .populate({
        path: 'propertyId',
        select: '-host',
      })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalBookings = await Booking.countDocuments({ userId });

    res.status(200).json({
      success: true,
      data: bookings,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalBookings / limit),
        totalItems: totalBookings,
        hasNext: page * limit < totalBookings,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching bookings' });
  }
};

export const updateBookingStatus: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bookingId = req.params.id;
    const { status, appointmentDate, agentName, agentPhone } = req.body;

    // Get the booking before updating to check if status changed
    const existingBooking = await Booking.findById(bookingId)
      .populate('userId')
      .populate({
        path: 'propertyId',
        populate: {
          path: 'host',
          model: 'User',
        },
      });

    if (!existingBooking) {
      res.status(404).json({ success: false, message: 'Booking not found' });
      return;
    }

    const oldStatus = existingBooking.status;

    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { status, appointmentDate, agentName, agentPhone },
      { new: true }
    ).populate('userId');

    if (!updatedBooking) {
      res.status(404).json({ success: false, message: 'Booking not found' });
      return;
    }

    // Send email if status changed
    if (oldStatus !== status) {
      try {
        const user = (updatedBooking as any).userId;
        const client = (updatedBooking as any).client;
        const property = updatedBooking.propertyId as any;
        const host = property?.host as any;
        const propertyDetails = await Property.findById(updatedBooking.propertyId);

        const recipientEmail = user?.email || client?.email;
        const recipientName = user?.name || client?.name || 'Valued Customer';

        if (!recipientEmail) {
          // Don't send email if no email
        } else {
          const emailSubject = `Booking Status Update - ${property?.title || 'Property'}`;
          const emailText = `
Dear ${recipientName},

Your booking status has been updated.

Booking Details:
- Property: ${propertyDetails?.title || 'N/A'}
- Location: ${propertyDetails?.location || 'N/A'}
- Status: ${status}
- Agent Name: ${agentName || 'N/A'}
- Agent Phone: ${agentPhone || 'N/A'}
- Booking Date: ${
            updatedBooking.createdAt
              ? new Date(updatedBooking.createdAt).toLocaleDateString()
              : 'N/A'
          }
${appointmentDate ? `- Appointment Date: ${new Date(appointmentDate).toLocaleDateString()}` : ''}

Best regards,
${env.ADMIN_NAME || 'Property Management Team'}
          `.trim();

          await mailTransporter.sendMail({
            from: env.SMTP_USER,
            to: recipientEmail,
            subject: emailSubject,
            text: emailText,
          });
        }
      } catch (emailError) {
        console.error('Error sending status update email:', emailError);
        // Don't fail the request if email fails
      }
    }

    res.status(200).json({ success: true, data: updatedBooking });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating booking status' });
  }
};
