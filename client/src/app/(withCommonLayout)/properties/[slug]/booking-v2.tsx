"use client";
import { useState, useEffect } from "react";
import { BookingServices } from "@/services/booking";
import LoginModal from "@/components/modals/LoginModal";
import { useAuthErrorHandler } from "@/hooks/useAuthErrorHandler";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PaymentModal from "@/components/modals/PaymentModal";
import renderClientForm from "./ClientForm";
import Success from "./success";

const { RangePicker } = DatePicker;

const getNumberOfDays = (range: [Dayjs | null, Dayjs | null]) => {
  const [start, end] = range;
  if (start && end) {
    const days = end.diff(start, "day");
    return days === 0 ? 1 : days;
  }
  return 0;
};

const Booking = ({
  propertyId,
  user,
  property,
}: {
  propertyId: string;
  user: any;
  property?: any;
}) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([
    null,
    null,
  ]);
  const [appointmentDate, setAppointmentDate] = useState<Dayjs | null>(null);
  const [existingBookings, setExistingBookings] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [pendingBookingData, setPendingBookingData] = useState<any>(null);
  const [agreed, setAgreed] = useState(false);

  const [localUser, setLocalUser] = useState(user);
  const [client, setClient] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    note: "",
    numberOfGuests: 1,
    numberOfAdults: 1,
    nid: null as File | null, // File object for NID image
    numberOfChildren: 0,
    guests: [] as string[], // Array to store additional guest names
    purposeOfLiving: "",
  });

  const createBookings = BookingServices.createBooking;
  const router = useRouter();

  const { showLoginModal, authError, handleApiError, closeLoginModal } =
    useAuthErrorHandler({
      customUnauthorizedMessage: "Please log in to book this property.",
      onLoginSuccess: () => {
        console.log("User logged in successfully");
      },
    });

  useEffect(() => {
    setLocalUser(user);
  }, [user]);

  useEffect(() => {
    const fetchExistingBookings = async () => {
      if (
        property?.listingType === "RENT" &&
        propertyId &&
        property?.rentDurationType === "FLEXIBLE"
      ) {
        try {
          setLoadingBookings(true);
          const response = await BookingServices.getBookingsByPropertyId(
            propertyId
          );
          const confirmedBookings = (response.data || []).filter(
            (booking: any) => booking.status === "confirmed"
          );
          setExistingBookings(confirmedBookings);
        } catch (error) {
          console.error("Error fetching existing bookings:", error);
        } finally {
          setLoadingBookings(false);
        }
      }
    };

    fetchExistingBookings();
  }, [propertyId, property?.listingType, property?.rentDurationType]);

  const isDateInBookingRange = (date: Dayjs) => {
    return existingBookings.some((booking: any) => {
      if (!booking.checkInDate || !booking.checkOutDate) return false;
      const checkIn = dayjs(booking.checkInDate);
      const checkOut = dayjs(booking.checkOutDate);
      return (
        (date.isAfter(checkIn, "day") || date.isSame(checkIn, "day")) &&
        (date.isBefore(checkOut, "day") || date.isSame(checkOut, "day"))
      );
    });
  };

  const isDateBlocked = (date: Dayjs) => {
    if (!property?.blockedDates) return false;
    return property.blockedDates.some((blockedDate: string) =>
      dayjs(blockedDate).isSame(date, "day")
    );
  };

  const disabledDate = (current: Dayjs) => {
    if (!current) return false;
    const today = dayjs().startOf("day");
    const propertyCheckIn = property?.checkinDate
      ? dayjs(property.checkinDate).startOf("day")
      : null;
    const propertyCheckOut = property?.checkoutDate
      ? dayjs(property.checkoutDate).startOf("day")
      : null;

    if (current.isBefore(today)) return true;
    if (propertyCheckIn && current.isBefore(propertyCheckIn)) return true;
    if (propertyCheckOut && current.isAfter(propertyCheckOut)) return true;
    if (isDateBlocked(current)) return true;
    if (isDateInBookingRange(current)) return true;

    return false;
  };

  const isPropertyUnavailable =
    property?.publishStatus === "SOLD" || property?.publishStatus === "RENTED";

  const handleBooking = async () => {
    try {
      setLoading(true);
      setError(null);

      const [checkInDate, checkOutDate] = dateRange;

      // Validation for flexible rent duration
      if (
        property?.listingType === "RENT" &&
        property?.rentDurationType === "FLEXIBLE"
      ) {
        if (!checkInDate || !checkOutDate) {
          setError("Please select check-in and check-out dates.");
          return;
        }

        if (
          checkOutDate.isBefore(checkInDate) ||
          checkOutDate.isSame(checkInDate)
        ) {
          setError("Check-out date must be after check-in date.");
          return;
        }

        // For guest bookings, prepare booking data with client info
        setPendingBookingData({
          propertyId,
          userId: localUser?.userId || null,
          checkInDate: checkInDate.toISOString(),
          checkOutDate: checkOutDate.toISOString(),
          paymentMethod: "manualPayment",
          client: {
            name: client.name.trim(),
            email: client.email.trim(),
            phone: client.phone?.trim() || "",
            address: client.address?.trim() || "",
            note: client.note?.trim() || "",
            numberOfGuests: client.numberOfGuests || null,
            nid: client.nid, // File object will be handled separately
            numberOfAdults:
              client.numberOfGuests - client.numberOfChildren || null, // Auto-calculated
            numberOfChildren: client.numberOfChildren || null,
            guests: client.guests.filter((name) => name.trim() !== ""), // Filter out empty names
          },
        });

        setIsPaymentModalOpen(true);
        return;
      }

      // Validation for non-flexible rent/sell appointments
      if (
        (property?.listingType === "RENT" ||
          property?.listingType === "SELL") &&
        property?.rentDurationType !== "FLEXIBLE" &&
        !appointmentDate
      ) {
        setError("Please select an appointment date.");
        return;
      }

      // Create booking data for non-flexible appointments
      const bookingData: any = {
        propertyId,
        paymentMethod: "Cash_Payment",
        appointmentRequestedDate: appointmentDate?.toISOString(),
        userId: localUser?.userId || null,
      };
      bookingData.client = {
        name: client.name.trim(),
        email: client.email.trim(),
        phone: client.phone?.trim() || "",
        address: client.address?.trim() || "",
        note: client.note?.trim() || "",
      };

      // For non-flexible bookings with client data, handle file uploads separately
      if (bookingData.client && client.nid) {
        // Create FormData for file upload
        const formData = new FormData();

        // Add all booking data except client.nid
        const bookingDataForForm = {
          ...bookingData,
          client: {
            ...bookingData.client,
            nid: undefined, // Remove nid from client object
          },
        };

        formData.append("bookingData", JSON.stringify(bookingDataForForm));
        formData.append("nid", client.nid); // Add file separately

        const response = await createBookings(formData);

        if (response.status === 201) {
          setSuccess(true);
          if (localUser?.userId) {
            router.push(`/my-bookings`);
          }

          setClient({
            name: "",
            email: "",
            phone: "",
            address: "",
            note: "",
            numberOfGuests: 1,
            numberOfAdults: 1,
            nid: null,
            numberOfChildren: 0,
            guests: [],
            purposeOfLiving: "",
          });
        }
      } else {
        // Regular JSON submission for bookings without files
        const response = await createBookings(JSON.stringify(bookingData));

        if (response.status === 201) {
          setSuccess(true);
          if (localUser?.userId) {
            router.push(`/my-bookings`);
          }
          setClient({
            name: "",
            email: "",
            phone: "",
            address: "",
            note: "",
            numberOfGuests: 1,
            numberOfAdults: 1,
            nid: null,
            numberOfChildren: 0,
            guests: [],
            purposeOfLiving: "",
          });
        }
      }
    } catch (err: any) {
      if (!handleApiError(err)) {
        if (err.response?.status === 403) {
          setError("Forbidden access. Please Log in as a user.");
        } else if (err.response?.status === 409) {
          setError(
            "You already have an appointment request for this property."
          );
        } else {
          setError("Failed to confirm booking. Please try again.");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async (formData: FormData) => {
    if (!pendingBookingData) return;

    // Append booking info to FormData
    Object.entries(pendingBookingData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        // Skip the client object for now, we'll handle it separately
        if (key === "client") return;

        // If value is an object (like date), stringify it
        if (typeof value === "object" && !(value instanceof File)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value as string | Blob);
        }
      }
    });

    // Handle client data separately
    if (pendingBookingData.client) {
      const clientData = pendingBookingData.client;

      // Append non-file client data as JSON
      const clientInfo = {
        name: clientData.name,
        email: clientData.email,
        phone: clientData.phone,
        address: clientData.address,
        note: clientData.note,
        numberOfGuests: clientData.numberOfGuests,
        numberOfAdults: clientData.numberOfAdults,
        numberOfChildren: clientData.numberOfChildren,
        guests: clientData.guests,
      };
      formData.append("client", JSON.stringify(clientInfo));

      // Append NID file separately if it exists
      if (clientData.nid && clientData.nid instanceof File) {
        formData.append("nid", clientData.nid);
      }
    }

    try {
      setLoading(true);
      const response = await BookingServices.createBooking(formData);
      if (response.status === 201) {
        setSuccess(true);
        if (localUser?.userId) {
          router.push(`/my-bookings`);
        }
      }
    } catch (err) {
      console.error("Payment submission failed", err);
      setError("Payment failed. Please try again.");
    } finally {
      setLoading(false);
      setIsPaymentModalOpen(false);
      setPendingBookingData(null);
    }
  };

  if (isPropertyUnavailable) {
    return (
      <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700 font-medium">
          This property is currently unavailable for booking as it has been{" "}
          {property?.publishStatus === "SOLD" ? "sold" : "rented"}.
        </p>
        <p className="text-red-600 mt-2">
          Please contact us for more information.{" "}
          <Link href="/contact" className="text-red-800 underline ml-1">
            Contact Us
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div>
      {property?.listingType === "RENT" &&
        property?.rentDurationType === "FLEXIBLE" && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Check-in and Check-out Dates
            </label>
            <RangePicker
              value={dateRange}
              onChange={(dates) => setDateRange(dates || [null, null])}
              disabledDate={disabledDate}
              format="YYYY-MM-DD"
              placeholder={["Check-in Date", "Check-out Date"]}
              className="w-full"
              disabled={loadingBookings}
            />
            {dateRange[0] && dateRange[1] && (
              <div className="mt-4 flex items-center justify-between bg-orange-50 border border-orange-200 rounded-lg px-4 py-3 shadow-sm">
                <span className="text-base font-semibold text-orange-700">
                  {getNumberOfDays(dateRange)}{" "}
                  {getNumberOfDays(dateRange) === 1 ? "night" : "nights"}
                </span>
                <span className="text-lg font-bold text-primary">
                  Total Cost:{" "}
                  {property?.price
                    ? `৳${property.price * getNumberOfDays(dateRange)}`
                    : "-"}
                </span>
              </div>
            )}
          </div>
        )}

      

      {renderClientForm(property, client, setClient, agreed, setAgreed)}
      {(property?.listingType === "RENT" || property?.listingType === "SELL") &&
        property?.rentDurationType !== "FLEXIBLE" && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Appointment Date
            </label>
            <DatePicker
              value={appointmentDate}
              onChange={(date) => setAppointmentDate(date)}
              disabledDate={disabledDate}
              format="YYYY-MM-DD"
              placeholder="Select appointment date"
              className="w-full"
            />
            <div className="text-xs text-gray-500 mt-1">
              Select a date for your appointment request
            </div>
          </div>
        )}

      {(error || authError) && (
        <div className="text-red-600 mb-3">{error || authError}</div>
      )}

      <button
        onClick={handleBooking}
        disabled={
          loading ||
          agreed === false ||
          (property?.listingType === "RENT" &&
            property?.rentDurationType === "FLEXIBLE" &&
            (!dateRange[0] || !dateRange[1]))
        }
        className="w-full py-3 bg-primary text-white rounded-md text-base font-medium mb-3 cursor-pointer hover:bg-primary hover:scale-103 transition transition-duration-200 disabled:bg-gray-400"
      >
        {loading ? "Processing..." : "Request for an Appointment"}
      </button>

      <LoginModal
        open={showLoginModal || isLoginModalOpen}
        onClose={() => {
          setIsLoginModalOpen(false);
          if (showLoginModal) closeLoginModal();
        }}
      />

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSubmit={handlePaymentSubmit}
      />

      {success && <Success onComplete={() => setSuccess(false)} />}
    </div>
  );
};

export default Booking;
