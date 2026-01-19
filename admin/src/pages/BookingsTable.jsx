import React, { useState, useEffect, useCallback } from "react";
import dayjs from "dayjs";
import {
  FaTrash,
  FaEye,
  FaHome,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaDownload,
  FaRedo,
  FaChevronLeft,
  FaChevronRight,
  FaCheckSquare,
  FaSquare,
  FaEdit,
  FaTimes,
  FaCheck,
} from "react-icons/fa";
import { MdPayment, MdConfirmationNumber, MdVerified } from "react-icons/md";
import { FiMoreVertical } from "react-icons/fi";

import { baseUrl } from "../constants/env";
import BookingServices from "../services/Booking.services";

const BookingsTable = ({ defaultListingType = "RENT" }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedListingType, setSelectedListingType] =
    useState(defaultListingType);
  const [deleteLoading, setDeleteLoading] = useState({});
  const [selectedBookings, setSelectedBookings] = useState([]);

  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });

  // UI state
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [calendarBooking, setCalendarBooking] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [agentName, setAgentName] = useState("");
  const [agentPhone, setAgentPhone] = useState("");
  const IMAGE_URL = import.meta.env.VITE_API_BASE_URL;

  // Fetch bookings with all parameters
  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        listingType: selectedListingType,
        page: pagination.currentPage,
        limit: pagination.itemsPerPage,
      };

      const response = await BookingServices.processGetAllBookings(params);
      setBookings(Array.isArray(response?.data) ? response.data : []);
      setPagination((prev) => ({
        ...prev,
        totalPages: response?.pagination?.totalPages || 1,
        totalItems: response?.pagination?.totalItems || 0,
      }));
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [selectedListingType, pagination.currentPage, pagination.itemsPerPage]);

  useEffect(() => {
    setSelectedListingType(defaultListingType);
  }, [defaultListingType]);

  useEffect(() => {
    fetchBookings();
    // fetchStats();
  }, [fetchBookings]);

  // Handle pagination
  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
  };

  const handleItemsPerPageChange = (newLimit) => {
    setPagination((prev) => ({
      ...prev,
      itemsPerPage: newLimit,
      currentPage: 1,
    }));
  };

  // Handle selection
  const handleSelectAll = () => {
    if (selectedBookings.length === bookings.length) {
      setSelectedBookings([]);
    } else {
      setSelectedBookings(bookings.map((booking) => booking._id));
    }
  };

  const handleSelectBooking = (bookingId) => {
    setSelectedBookings((prev) =>
      prev.includes(bookingId)
        ? prev.filter((id) => id !== bookingId)
        : [...prev, bookingId]
    );
  };

  // Handle bulk actions
  const handleBulkDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedBookings.length} bookings?`
      )
    ) {
      return;
    }

    try {
      await BookingServices.processBulkDeleteBookings(selectedBookings);
      setSelectedBookings([]);
      fetchBookings();
      alert("Bookings deleted successfully!");
    } catch (error) {
      console.error("Error bulk deleting bookings:", error);
      alert("Failed to delete some bookings. Please try again.");
    }
  };

  const handleBulkStatusUpdate = async (newStatus) => {
    if (newStatus === "confirmed") {
      // For bulk confirmation, we'll use today's date as default
      const today = new Date().toISOString().split("T")[0];
      try {
        const updatePromises = selectedBookings.map((id) =>
          BookingServices.processUpdateBookingStatus(id, {
            status: newStatus,
            appointmentDate: today,
          })
        );
        await Promise.all(updatePromises);
        setSelectedBookings([]);
        fetchBookings();
        alert("Booking statuses updated successfully!");
      } catch (error) {
        console.error("Error updating booking statuses:", error);
        alert("Failed to update some booking statuses. Please try again.");
      }
    } else {
      // For non-confirmed statuses, update directly
      try {
        const updatePromises = selectedBookings.map((id) =>
          BookingServices.processUpdateBookingStatus(id, { status: newStatus })
        );
        await Promise.all(updatePromises);
        setSelectedBookings([]);
        fetchBookings();
        alert("Booking statuses updated successfully!");
      } catch (error) {
        console.error("Error updating booking statuses:", error);
        alert("Failed to update some booking statuses. Please try again.");
      }
    }
  };

  // Handle individual actions
  const handleDelete = async (bookingId) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) {
      return;
    }

    setDeleteLoading((prev) => ({ ...prev, [bookingId]: true }));
    try {
      await BookingServices.processDeleteBooking(bookingId);
      setBookings((prev) =>
        prev.filter((booking) => booking._id !== bookingId)
      );
      alert("Booking deleted successfully!");
    } catch (error) {
      console.error("Error deleting booking:", error);
      alert("Failed to delete booking. Please try again.");
    } finally {
      setDeleteLoading((prev) => ({ ...prev, [bookingId]: false }));
    }
  };

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setShowViewModal(true);
  };

  const handleUpdateStatus = async (bookingId, newStatus) => {
    if (newStatus === "confirmed") {
      // Find the booking to get the requested date
      const booking = bookings.find((b) => b._id === bookingId);
      if (booking) {
        setCalendarBooking(booking);
        setSelectedDate(
          booking.appointmentRequestedDate
            ? new Date(booking.appointmentRequestedDate)
                .toISOString()
                .split("T")[0]
            : new Date().toISOString().split("T")[0]
        );
        setSelectedTime(
          booking.appointmentRequestedDate
            ? new Date(booking.appointmentRequestedDate)
                .toISOString()
                .split("T")[1]
                .substring(0, 5)
            : ""
        );
        setShowCalendarModal(true);
      }
    } else {
      // For non-confirmed statuses, update directly
      try {
        await BookingServices.processUpdateBookingStatus(bookingId, {
          status: newStatus,
          agentName,
          agentPhone,
        });
        fetchBookings();
        alert("Booking status updated successfully!");
      } catch (error) {
        console.error("Error updating booking status:", error);
        alert("Failed to update booking status. Please try again.");
      }
    }
  };

  const handleCalendarConfirm = async () => {
    if (!calendarBooking || !selectedDate) return;

    // Combine date and time into a full ISO string
    const time = selectedTime || "00:00"; // Default to midnight if no time selected
    const appointmentDate = new Date(`${selectedDate}T${time}`).toISOString();

    try {
      await BookingServices.processUpdateBookingStatus(calendarBooking._id, {
        status: "confirmed",
        appointmentDate, // Send combined date-time
        agentName,
        agentPhone,
      });
      setShowCalendarModal(false);
      setCalendarBooking(null);
      setSelectedDate("");
      setSelectedTime(""); // Reset time
      fetchBookings();
      alert("Booking confirmed successfully!");
    } catch (error) {
      console.error("Error confirming booking:", error);
      alert("Failed to confirm booking. Please try again.");
    }
  };

  // Export functionality
  const handleExport = () => {
    const csvData = bookings.map((booking) => ({
      "Booking ID": booking._id,
      "Property Title": booking.propertyId?.title || "N/A",
      "Client Name": booking.client?.name || "N/A",
      "Client Email": booking.client?.email || "N/A",
      "Host Name": booking.propertyId?.host?.name || "N/A",
      Price: `${booking.propertyId?.price || 0} ${
        booking.propertyId?.priceUnit || ""
      }`,
      Status: booking.status,
      "Payment Status": booking.paymentStatus,
      "Check-in Date": formatDate(
        booking.checkInDate || booking.propertyId?.checkinDate
      ),
      "Check-out Date": formatDate(
        booking.checkOutDate || booking.propertyId?.checkoutDate
      ),
      "Created At": formatDate(booking.createdAt),
    }));

    const csvString = [
      Object.keys(csvData[0]).join(","),
      ...csvData.map((row) => Object.values(row).join(",")),
    ].join("\n");

    const blob = new Blob([csvString], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bookings_${selectedListingType}_${
      new Date().toISOString().split("T")[0]
    }.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Utility functions
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatPrice = (price, unit) => {
    return `${price?.toLocaleString()} ${unit}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-primary-100 text-primary";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "unpaid":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-primary-100 text-primary";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {selectedListingType === "RENT"
                ? "Rental Bookings"
                : "Sale Bookings"}{" "}
              Management
            </h1>
            <p className="text-gray-600 text-lg">
              Manage all {selectedListingType === "RENT" ? "rental" : "sale"}{" "}
              property bookings
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleExport}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <FaDownload className="mr-2" />
              Export
            </button>

            <button
              onClick={fetchBookings}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <FaRedo className="mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedBookings.length > 0 && (
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 shadow-inner">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-800">
                {selectedBookings.length} booking
                {selectedBookings.length > 1 ? "s" : ""} selected
              </span>
              <div className="flex items-center gap-3">
                <select
                  onChange={(e) =>
                    e.target.value && handleBulkStatusUpdate(e.target.value)
                  }
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
                  defaultValue=""
                >
                  <option value="">Update Status</option>
                  <option value="confirmed">Confirm</option>
                  <option value="cancelled">Cancel</option>
                  <option value="pending">Set Pending</option>
                </select>
                <button
                  onClick={handleBulkDelete}
                  className="px-4 py-2 text-sm bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Delete Selected
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
            <span className="ml-4 text-gray-600 text-lg">
              Loading bookings...
            </span>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaHome className="text-4xl text-gray-400" />
            </div>
            <p className="text-gray-600 text-xl font-medium">
              No {selectedListingType === "RENT" ? "rental" : "sale"} bookings
              found
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Bookings will appear here once properties are booked
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 shadow-sm">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={
                        selectedBookings.length === bookings.length &&
                        bookings.length > 0
                      }
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Property Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    User & Host Info
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Price & Location
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Booking Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <tr
                    key={booking._id}
                    className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedBookings.includes(booking._id)}
                        onChange={() => handleSelectBooking(booking._id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>

                    {/* Property Details */}
                    <td className="px-6 py-4">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          {booking.propertyId?.coverImage ? (
                            <img
                              src={`${baseUrl}${booking.propertyId.coverImage}`}
                              alt={booking.propertyId?.title}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                              <FaHome className="text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {booking.propertyId?.title || "Untitled Property"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {booking.propertyId?.numberOfRooms
                              ? `${booking.propertyId.numberOfRooms} rooms`
                              : "N/A"}{" "}
                            •{" "}
                            {booking.propertyId?.size
                              ? `${booking.propertyId.size} ${booking.propertyId.sizeUnit}`
                              : "Size N/A"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* User & Host Info */}
                    <td className="px-6 py-4">
                      <div className="space-y-3">
                        {/* Client Info */}
                        <div className="flex items-center space-x-2">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 text-xs font-medium">
                                {booking.client?.name?.charAt(0) || "G"}
                              </span>
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {booking.client?.name || "Guest User"}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {booking.client?.email || "No email"}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {booking.client?.phone || "N/A"}
                            </p>
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                booking.userId
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {booking.userId ? "Registered" : "Unregistered"}
                            </span>
                          </div>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-gray-200"></div>

                        {/* Host Info */}
                        <div className="flex items-center space-x-2">
                          <div className="flex-shrink-0">
                            {booking.propertyId?.host?.avatar ? (
                              <img
                                src={`${baseUrl}${booking.propertyId.host.avatar}`}
                                alt={booking.propertyId.host.name}
                                className="w-8 h-8 rounded-full object-cover ring-2 ring-orange-200"
                              />
                            ) : (
                              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center ring-2 ring-orange-200">
                                <span className="text-primary text-xs font-medium">
                                  {booking.propertyId?.host?.name?.charAt(0) ||
                                    "H"}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {booking.propertyId?.host?.name || "Host"}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {booking.propertyId?.host?.email || "No email"}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {booking.propertyId?.host?.phone || "N/A"}
                            </p>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                              {booking.propertyId?.host?.role || "host"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Price & Location */}
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 font-medium">
                        {booking.propertyId.listingType === "RENT" &&
                        booking.propertyId.rentDurationType === "FLEXIBLE" ? (
                          <>
                            {formatPrice(
                              booking.propertyId.price *
                                (booking.checkInDate && booking.checkOutDate
                                  ? Math.max(
                                      1,
                                      dayjs(booking.checkOutDate).diff(
                                        dayjs(booking.checkInDate),
                                        "day"
                                      )
                                    )
                                  : 1),
                              booking.propertyId.priceUnit
                            )}
                            <span className="text-xs text-gray-500 ml-1">
                              (
                              {Math.max(
                                1,
                                dayjs(booking.checkOutDate).diff(
                                  dayjs(booking.checkInDate),
                                  "day"
                                )
                              )}{" "}
                              nights)
                            </span>
                          </>
                        ) : (
                          <>
                            {formatPrice(
                              booking.propertyId.price,
                              booking.propertyId.priceUnit
                            )}
                          </>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-32">
                        {booking.propertyId?.location || "N/A"}
                      </div>
                    </td>

                    {/* Booking Status */}
                    <td className="px-6 py-4">
                      <select
                        value={booking.status}
                        onChange={(e) =>
                          handleUpdateStatus(booking._id, e.target.value)
                        }
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border-0 ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>

                    {/* Payment */}
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(
                            booking.paymentStatus
                          )}`}
                        >
                          <MdPayment className="mr-1" />
                          {booking.paymentStatus}
                        </span>
                        <p className="text-xs text-gray-500">
                          {booking.paymentMethod?.replace("_", " ")}
                        </p>
                      </div>
                    </td>

                    {/* Dates */}
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <FaCalendarAlt className="mr-1 text-xs" />
                          <span>
                            In:{" "}
                            {formatDate(
                              booking.checkInDate ||
                                booking.propertyId?.checkinDate
                            )}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <FaCalendarAlt className="mr-1 text-xs" />
                          <span>
                            Out:{" "}
                            {formatDate(
                              booking.checkOutDate ||
                                booking.propertyId?.checkoutDate
                            )}
                          </span>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          Created: {formatDate(booking.createdAt)}
                        </div>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-3">
                        <button
                          onClick={() => handleViewBooking(booking)}
                          className="text-blue-600 hover:text-white hover:bg-blue-600 transition-all duration-200 p-2 rounded-lg hover:shadow-lg"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => handleDelete(booking._id)}
                          disabled={deleteLoading[booking._id]}
                          className="text-red-600 hover:text-white hover:bg-red-600 transition-all duration-200 p-2 rounded-lg hover:shadow-lg disabled:opacity-50"
                          title="Delete Booking"
                        >
                          {deleteLoading[booking._id] ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                          ) : (
                            <FaTrash />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {bookings.length > 0 && (
        <div className="bg-white px-6 py-4 border-t border-gray-200 rounded-b-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-700">Show</span>
              <select
                value={pagination.itemsPerPage}
                onChange={(e) =>
                  handleItemsPerPageChange(Number(e.target.value))
                }
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-sm font-medium text-gray-700">entries</span>
            </div>

            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-semibold">
                  {(pagination.currentPage - 1) * pagination.itemsPerPage + 1}
                </span>{" "}
                to{" "}
                <span className="font-semibold">
                  {Math.min(
                    pagination.currentPage * pagination.itemsPerPage,
                    pagination.totalItems
                  )}
                </span>{" "}
                of{" "}
                <span className="font-semibold">{pagination.totalItems}</span>{" "}
                entries
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-md"
              >
                <FaChevronLeft />
              </button>

              <div className="flex items-center space-x-1">
                {Array.from(
                  { length: Math.min(5, pagination.totalPages) },
                  (_, i) => {
                    const pageNumber =
                      Math.max(1, pagination.currentPage - 2) + i;
                    if (pageNumber > pagination.totalPages) return null;

                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`px-4 py-2 border rounded-lg text-sm transition-all duration-200 ${
                          pagination.currentPage === pageNumber
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-600 shadow-lg"
                            : "border-gray-300 hover:bg-gray-50 hover:shadow-md"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  }
                )}
              </div>

              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-md"
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Calendar Modal for Booking Confirmation */}
      {showCalendarModal && calendarBooking && (
        <div className="fixed inset-0 bg-opacity-30 backdrop-blur-lg flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Confirm Booking
                </h2>
                <button
                  onClick={() => setShowCalendarModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">
                    Property Details
                  </h3>
                  <p className="text-sm text-gray-600">
                    {calendarBooking.propertyId?.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    {calendarBooking.propertyId?.location}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">
                    Client Information
                  </h3>
                  <p className="text-sm text-gray-600">
                    {calendarBooking.client?.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {calendarBooking.client?.email}
                  </p>
                  <p className="text-sm text-gray-500">
                    {calendarBooking.userId ? "Member" : "Guest"}
                  </p>
                </div>

                {calendarBooking.appointmentRequestedDate && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h3 className="font-medium text-blue-900 mb-2">
                      Requested Date
                    </h3>
                    <p className="text-sm text-blue-800">
                      {formatDate(calendarBooking.appointmentRequestedDate)}
                    </p>
                  </div>
                )}

                {/* Always show date and time selection */}
                <div>
                  {calendarBooking.propertyId?.listingType === "RENT" &&
                  calendarBooking.propertyId?.rentDurationType ===
                    "FLEXIBLE" ? (
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Check in Date
                    </label>
                  ) : (
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Appointment Date
                    </label>
                  )}
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                  />
                  {selectedDate && (
                    <p className="text-xs text-gray-500 mt-1">
                      Selected Date: {formatDate(selectedDate)}
                    </p>
                  )}

                  {calendarBooking.propertyId?.listingType === "RENT" &&
                  calendarBooking.propertyId?.rentDurationType ===
                    "FLEXIBLE" ? (
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Check in Time
                    </label>
                  ) : (
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Appointment Time
                    </label>
                  )}

                  <input
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {selectedTime && (
                    <p className="text-xs text-gray-500 mt-1">
                      Selected Time: {selectedTime}
                    </p>
                  )}

                  <input
                    type="text"
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    placeholder="Enter Agent Name"
                    className="w-full mt-6 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />

                  <input
                    type="text"
                    value={agentPhone}
                    onChange={(e) => setAgentPhone(e.target.value)}
                    placeholder="Enter Agent Phone"
                    className="w-full mt-6 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Optional: Add a note for flexible rentals */}
                {/* {calendarBooking.propertyId?.rentDurationType ===
                  "flexible" && (
                  <div className="bg-primary-50 p-4 rounded-lg border border-yellow-200">
                    <p className="text-sm text-primary">
                      This is a flexible rental. No specific appointment date is
                      required.
                    </p>
                  </div>
                )} */}
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowCalendarModal(false);
                    setSelectedDate("");
                    setSelectedTime("");
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCalendarConfirm}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Booking Modal */}
      {showViewModal && selectedBooking && (
        <div className="fixed inset-0 bg-opacity-30 backdrop-blur-lg flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full mx-4 max-h-[95vh] overflow-y-auto transform transition-all duration-300 scale-100">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Booking Details
                </h2>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Property Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Property Information
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <img
                      src={`${baseUrl}${selectedBooking.propertyId?.coverImage}`}
                      alt={selectedBooking.propertyId?.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <h4 className="font-medium text-gray-900">
                      {selectedBooking.propertyId?.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {selectedBooking.propertyId?.location}
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedBooking.propertyId?.numberOfRooms} rooms •{" "}
                      {selectedBooking.propertyId?.size}{" "}
                      {selectedBooking.propertyId?.sizeUnit}
                    </p>
                    <p className="text-lg font-bold text-blue-600 mt-2">
                      {formatPrice(
                        selectedBooking.totalAmount,
                        selectedBooking.propertyId?.priceUnit
                      )}
                    </p>
                  </div>
                </div>

                {/* Booking Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Booking Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Booking ID:</span>
                      <span className="text-sm font-medium">
                        {selectedBooking._id}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Status:</span>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          selectedBooking.status
                        )}`}
                      >
                        {selectedBooking.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Payment Status:
                      </span>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(
                          selectedBooking.paymentStatus
                        )}`}
                      >
                        {selectedBooking.paymentStatus}
                      </span>
                    </div>
                    {selectedBooking && selectedBooking.paymentId && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          Payment Method:
                        </span>
                        <span className="text-sm font-medium">
                          {selectedBooking?.paymentId?.method}
                        </span>
                      </div>
                    )}

                    {selectedBooking &&
                      selectedBooking.paymentId &&
                      selectedBooking.paymentId.tran_id && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Transaction Id:
                          </span>
                          <span className="text-sm font-medium">
                            {selectedBooking?.paymentId?.tran_id}
                          </span>
                        </div>
                      )}

                    {selectedBooking &&
                      selectedBooking.paymentId &&
                      selectedBooking.paymentId.paymentDate && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Payment date:
                          </span>
                          <span className="text-sm font-medium">
                            {selectedBooking?.paymentId?.paymentDate
                              ? dayjs(
                                  selectedBooking.paymentId.paymentDate
                                ).format("MMMM DD, YYYY")
                              : "-"}
                          </span>
                        </div>
                      )}

                    {selectedBooking &&
                      selectedBooking.paymentId &&
                      selectedBooking.paymentId.paymentProof && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            paymentProof:
                          </span>
                          <span className="text-sm font-medium">
                            {
                              <a
                                href={`${IMAGE_URL}${selectedBooking?.paymentId?.paymentProof}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Download
                              </a>
                            }
                          </span>
                        </div>
                      )}

                    {selectedBooking.checkInDate && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Check-in:</span>
                        <span className="text-sm font-medium">
                          {formatDate(
                            selectedBooking.checkInDate ||
                              selectedBooking.propertyId?.checkinDate
                          )}
                        </span>
                      </div>
                    )}
                    {selectedBooking.checkOutDate && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          Check-out:
                        </span>
                        <span className="text-sm font-medium">
                          {formatDate(
                            selectedBooking.checkOutDate ||
                              selectedBooking.propertyId?.checkoutDate
                          )}
                        </span>
                      </div>
                    )}

                    {selectedBooking.agentName && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          Agent Name:
                        </span>
                        <span className="text-sm font-medium">
                          {selectedBooking.agentName}
                        </span>
                      </div>
                    )}

                    {selectedBooking.agentPhone && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          Agent Phone:
                        </span>
                        <span className="text-sm font-medium">
                          {selectedBooking.agentPhone}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Created:</span>
                      <span className="text-sm font-medium">
                        {formatDate(selectedBooking.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* User Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Client Information
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                          {selectedBooking.client?.name?.charAt(0) || "G"}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {selectedBooking.client?.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {selectedBooking.client?.email}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Phone: {selectedBooking.client?.phone || "N/A"}
                    </p>

                    {selectedBooking.client?.address && (
                      <p className="text-sm text-gray-600">
                        Address: {selectedBooking.client?.address || "N/A"}
                      </p>
                    )}
                    {selectedBooking.client?.nid && (
                      <p className="text-sm text-gray-600">
                        NID:{" "}
                        {
                          <a
                            className="text-blue-600 hover:underline"
                            href={`${baseUrl}/uploads/${selectedBooking.client?.nid}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Download
                          </a>
                        }
                      </p>
                    )}
                    {selectedBooking.client?.numberOfGuests ||
                    selectedBooking.client?.numberOfAdults > 0 ||
                    selectedBooking.client?.numberOfChildren > 0 ? (
                      <>
                        <span className="text-sm text-gray-600 mr-4">
                          No. of Guests:{" "}
                          {selectedBooking.client?.numberOfGuests || "N/A"}
                        </span>
                        <span className="text-sm text-gray-600 mr-4">
                          No. of Adults:{" "}
                          {selectedBooking.client?.numberOfAdults || "N/A"}
                        </span>
                        <span className="text-sm text-gray-600 mr-4">
                          No. of Children:{" "}
                          {selectedBooking.client?.numberOfChildren || "N/A"}
                        </span>
                      </>
                    ) : null}
                    {selectedBooking.client?.guests &&
                      selectedBooking.client?.guests.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600 font-medium">
                            Additional Guests:
                          </p>
                          <ul className="list-disc list-inside">
                            {selectedBooking.client.guests.map(
                              (guest, index) => (
                                <li
                                  key={index}
                                  className="text-sm text-gray-600"
                                >
                                  {guest}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}

                    {selectedBooking.client?.note && (
                      <p className="text-sm text-gray-600">
                        Note: {selectedBooking.client?.note || "N/A"}
                      </p>
                    )}
                    <p className="text-sm text-gray-600">
                      Type: {selectedBooking.userId ? "Member" : "Guest"}
                    </p>
                  </div>
                </div>

                {/* Host Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Host Information
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-3 mb-3">
                      {selectedBooking.propertyId?.host?.avatar ? (
                        <img
                          src={`${baseUrl}${selectedBooking.propertyId.host.avatar}`}
                          alt={selectedBooking.propertyId.host.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                          <span className="text-primary font-medium">
                            {selectedBooking.propertyId?.host?.name?.charAt(
                              0
                            ) || "H"}
                          </span>
                        </div>
                      )}
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {selectedBooking.propertyId?.host?.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {selectedBooking.propertyId?.host?.email}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Phone: {selectedBooking.propertyId?.host?.phone || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">
                      Role: {selectedBooking.propertyId?.host?.role || "host"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsTable;
