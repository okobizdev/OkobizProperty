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

const { RangePicker } = DatePicker;

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
  const createBookings = BookingServices.createBooking;
  const router = useRouter();

  const { showLoginModal, authError, handleApiError, closeLoginModal } =
    useAuthErrorHandler({
      customUnauthorizedMessage: "Please log in to book this property.",
      onLoginSuccess: () => {
        // Optionally retry booking after successful login
        console.log("User logged in successfully");
      },
    });

  // Fetch existing bookings for the property
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
          setExistingBookings(response.data || []);
        } catch (error) {
          console.error("Error fetching existing bookings:", error);
          // Don't show error to user, just continue without existing bookings
        } finally {
          setLoadingBookings(false);
        }
      }
    };

    fetchExistingBookings();
  }, [propertyId, property?.listingType, property?.rentDurationType]);

  // Helper function to check if a date is in any existing booking range
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

  // Helper function to check if a date is blocked
  const isDateBlocked = (date: Dayjs) => {
    if (!property?.blockedDates) return false;
    return property.blockedDates.some((blockedDate: string) =>
      dayjs(blockedDate).isSame(date, "day")
    );
  };

  // Helper function to disable dates in the calendar
  const disabledDate = (current: Dayjs) => {
    if (!current) return false;

    const today = dayjs().startOf("day");
    const propertyCheckIn = property?.checkinDate
      ? dayjs(property.checkinDate).startOf("day")
      : null;
    const propertyCheckOut = property?.checkoutDate
      ? dayjs(property.checkoutDate).startOf("day")
      : null;

    // Disable past dates
    if (current.isBefore(today)) return true;

    // Disable dates outside property availability window
    if (propertyCheckIn && current.isBefore(propertyCheckIn)) return true;
    if (propertyCheckOut && current.isAfter(propertyCheckOut)) return true;

    // Disable blocked dates
    if (isDateBlocked(current)) return true;

    // Disable dates that are already booked
    if (isDateInBookingRange(current)) return true;

    return false;
  };

  const handleBooking = async () => {
    try {
      setLoading(true);
      setError(null);

      const [checkInDate, checkOutDate] = dateRange;

      // For RENT properties, validate dates
      if (
        property?.listingType === "RENT" &&
        property?.rentDurationType === "FLEXIBLE"
      ) {
        if (!checkInDate || !checkOutDate) {
          setError("Please select check-in and check-out dates.");
          setLoading(false);
          return;
        }

        if (
          checkOutDate.isBefore(checkInDate) ||
          checkOutDate.isSame(checkInDate)
        ) {
          setError("Check-out date must be after check-in date.");
          setLoading(false);
          return;
        }
      }

      // For RENT properties with NON-FLEXIBLE duration, validate appointment date
      if (
        (property?.listingType === "RENT" ||
          property?.listingType === "SELL") &&
        property?.rentDurationType !== "FLEXIBLE"
      ) {
        if (!appointmentDate) {
          setError("Please select an appointment date.");
          setLoading(false);
          return;
        }
      }

      // Prepare booking data
      const bookingData = {
        propertyId,
        userId: user?.userId, // Use actual user ID
        paymentMethod: "Cash_Payment", // Example payment method
        ...(property?.listingType === "RENT" &&
          property?.rentDurationType === "FLEXIBLE" && {
            checkInDate: checkInDate?.toISOString(),
            checkOutDate: checkOutDate?.toISOString(),
          }),
        ...((property?.listingType === "RENT" ||
          property?.listingType === "SELL") &&
          property?.rentDurationType !== "FLEXIBLE" && {
            appointmentRequestedDate: appointmentDate?.toISOString(),
          }),
      };

      // Call the booking API
      const response = await createBookings(bookingData);

      if (response.status === 201) {
        setSuccess(true);
        router.push(`/my-bookings/${user?.userId}`);
      }
    } catch (err) {
      const error = err as { response?: { status?: number } };

      // Use the auth error handler for 401 errors
      if (!handleApiError(error)) {
        // Handle other types of errors
        if (error.response && error.response.status == 403) {
          setError("Forbidden access. Please Log in as a user.");
        } else if (error.response && error.response.status == 409) {
          setError(
            "You already have an appointment request for this property."
          );
        } else {
          console.log(err);
          setError("Failed to confirm booking. Please try again.");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const isPropertyUnavailable =
    property?.publishStatus === "SOLD" || property?.publishStatus === "RENTED";

  return (
    <div>
      {success ? (
        <div className="text-green-600 font-medium">Booking Confirmed!</div>
      ) : (
        <>
          {isPropertyUnavailable ? (
            <div className="space-y-2">
              <div className="text-red-600 font-medium">
                This property is already{" "}
                {property?.publishStatus === "SOLD" ? "sold" : "rented"}.
              </div>
              <div>
                For More Details Please Contact Us{" "}
                <Link
                  href="/contact"
                  className="text-blue-600 underline"
                  target="_blank"
                >
                  Contact Page
                </Link>{" "}
                Or Call Us:{" "}
                <a
                  href="tel:+8801700000000"
                  className="text-blue-600 underline"
                >
                  +8801700000000
                </a>
              </div>
            </div>
          ) : (
            <>
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
                    {property.checkinDate && (
                      <div className="text-xs text-gray-500 mt-1">
                        Available from:{" "}
                        {dayjs(property.checkinDate).format("YYYY-MM-DD")}
                        {property.checkoutDate &&
                          ` to ${dayjs(property.checkoutDate).format(
                            "YYYY-MM-DD"
                          )}`}
                        {loadingBookings && " • Loading existing bookings..."}
                      </div>
                    )}
                  </div>
                )}

              {/* Appointment Date Picker for RENT properties with NON-FLEXIBLE duration */}
              {(property?.listingType === "RENT" ||
                property?.listingType === "SELL") &&
                property?.rentDurationType !== "FLEXIBLE" && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Appointment Date
                    </label>
                    <DatePicker
                      value={appointmentDate}
                      onChange={(date) => setAppointmentDate(date)}
                      disabledDate={(current) => {
                        if (!current) return false;
                        const today = dayjs().startOf("day");
                        // Disable past dates
                        if (current.isBefore(today)) return true;
                        // Disable blocked dates
                        if (isDateBlocked(current)) return true;
                        return false;
                      }}
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
                  isPropertyUnavailable ||
                  (property?.listingType === "RENT" &&
                    property?.rentDurationType === "FLEXIBLE" &&
                    (!dateRange[0] || !dateRange[1]))
                }
                className="w-full py-3 bg-primary text-white rounded-md text-base font-medium mb-3 cursor-pointer hover:bg-orange-600 disabled:bg-gray-400"
              >
                {loading
                  ? "Processing..."
                  : property?.publishStatus === "SOLD"
                  ? "Property Sold"
                  : property?.publishStatus === "RENTED"
                  ? "Property Rented"
                  : "Request for an Appointment"}
              </button>
            </>
          )}
        </>
      )}

      <LoginModal open={showLoginModal} onClose={closeLoginModal} />
    </div>
  );
};

export default Booking;
