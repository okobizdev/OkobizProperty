"use client";
import React, { useEffect, useState } from "react";
import { BookingServices } from "@/services/booking";
import Image from "next/image";
import useAuth from "@/hooks/useAuth";

interface Booking {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  propertyId: {
    _id: string;
    title: string;
    location: string;
    price: number;
    priceUnit: string;
    listingType: string;
    size: number | null;
    sizeUnit: string;
    images: string[];
    coverImage: string;
    numberOfRooms: number | null;
    publishStatus: string;
    description: string;
  };
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
  checkInDate: string | null;
  checkOutDate: string | null;
  appointmentRequestedDate: string | null;
  appointmentDate: string | null;
  totalAmount: number;
  numberOfGuests: number;
}

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const itemsPerPage = 3;
  const IMAGE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || null;
  const { user } = useAuth();
  const id = user?.userId;

  useEffect(() => {
    // if (!user?.userId) {
    //   setLoading(false);
    //   return;
    // }
    const fetchBookings = async () => {
      try {
        if (id === undefined) return;

        const response = await BookingServices.getBookingsByUserId(id, {
          page: currentPage,
          limit: itemsPerPage,
        });
        setBookings(response.data);
        if (response.pagination) {
          setTotalPages(response.pagination.totalPages || 1);
          setTotalItems(response.pagination.totalItems || 0);
          setHasNext(response.pagination.hasNext || false);
          setHasPrev(response.pagination.hasPrev || false);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [id, currentPage]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!id) {
    return <div>Invalid user ID</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>
        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No bookings found.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Property Image */}
                  <div className="md:w-1/4 relative h-48 md:h-auto bg-gray-200">
                    {booking.propertyId.coverImage ? (
                      <Image
                        src={`${IMAGE_URL}${booking.propertyId.coverImage}`}
                        alt={booking.propertyId.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Property Details */}
                  <div className="md:w-3/4 p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h2 className="text-2xl font-bold text-gray-900">
                            {booking.propertyId.title}
                          </h2>
                          <span
                            className={`px-3 py-1 text-sm font-semibold rounded-full ${
                              booking.propertyId.listingType === "SELL"
                                ? "bg-green-100 text-green-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {booking.propertyId.listingType}
                          </span>
                        </div>

                        <p className="text-gray-600 mb-3 flex items-center">
                          <span className="mr-2">📍</span>
                          {booking.propertyId.location}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-3xl font-bold text-green-600 mb-1">
                          {booking.totalAmount.toLocaleString()}{" "}
                          {booking.propertyId.priceUnit}
                        </p>
                        {booking.propertyId.size && (
                          <p className="text-gray-500 text-sm">
                            Size: {booking.propertyId.size}{" "}
                            {booking.propertyId.sizeUnit}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Property Features */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      {booking.propertyId.numberOfRooms && (
                        <div className="text-center">
                          <p className="text-2xl">🏠</p>
                          <p className="text-sm text-gray-600">Rooms</p>
                          <p className="font-semibold">
                            {booking.propertyId.numberOfRooms}
                          </p>
                        </div>
                      )}
                      <div className="text-center">
                        <p className="text-2xl">📅</p>
                        <p className="text-sm text-gray-600">Booked On</p>
                        <p className="font-semibold text-sm">
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl">💰</p>
                        <p className="text-sm text-gray-600">Payment</p>
                        <p
                          className={`font-semibold ${
                            booking.paymentStatus === "paid"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {booking.paymentStatus}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl">📋</p>
                        <p className="text-sm text-gray-600">Status</p>
                        <p
                          className={`font-semibold ${
                            booking.status === "confirmed"
                              ? "text-green-600"
                              : "text-primary"
                          }`}
                        >
                          {booking.status}
                        </p>
                      </div>
                    </div>

                    {/* Additional Details */}
                    <div className="border-t pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">
                            Booking Details
                          </h3>
                          <div className="space-y-1 text-sm">
                            <p>
                              <span className="font-medium">
                                Payment Method:
                              </span>{" "}
                              {booking.paymentMethod}
                            </p>
                            <p>
                              <span className="font-medium">
                                Property Status:
                              </span>{" "}
                              {booking.propertyId.publishStatus}
                            </p>
                            {booking.checkInDate && booking.checkOutDate && (
                              <p>
                                <span className="font-medium">Stay Dates:</span>{" "}
                                {new Date(
                                  booking.checkInDate
                                ).toLocaleDateString()}{" "}
                                -{" "}
                                {new Date(
                                  booking.checkOutDate
                                ).toLocaleDateString()}
                              </p>
                            )}
                            {booking.appointmentDate ? (
                              <p>
                                <span className="font-medium">
                                  Appointment Scheduled:
                                </span>{" "}
                                {new Date(
                                  booking.appointmentDate
                                ).toLocaleString("en-GB", {
                                  timeZone: "Asia/Dhaka",
                                  year: "numeric",
                                  month: "2-digit",
                                  day: "2-digit",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                })}
                              </p>
                            ) : (
                              <p>
                                <span className="font-medium">
                                  Appointment Requested:
                                </span>{" "}
                                {booking.appointmentRequestedDate
                                  ? new Date(
                                      booking.appointmentRequestedDate
                                    ).toLocaleDateString()
                                  : "N/A"}
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">
                            Property Features
                          </h3>
                          <div className="space-y-1 text-sm">
                            {booking.numberOfGuests && (
                              <p>
                                <span className="font-medium">
                                  Number of Guests:
                                </span>{" "}
                                {booking.numberOfGuests}
                              </p>
                            )}
                            {booking.propertyId.description && (
                              <p>
                                <span className="font-medium">
                                  Description:
                                </span>{" "}
                                {booking.propertyId.description.substring(
                                  0,
                                  100
                                )}
                                ...
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600">
              Showing {bookings.length} of {totalItems} bookings
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={!hasPrev}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-600">Page</span>
                <span className="px-3 py-1 text-sm font-medium text-gray-900 bg-gray-100 rounded">
                  {currentPage} of {totalPages}
                </span>
              </div>
              <button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={!hasNext}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookingsPage;
