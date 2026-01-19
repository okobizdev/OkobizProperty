import BookingApis from "../apis/booking.apis";

const {
    getAllBookingApi,
    getBookingByIdApi,
    deleteBookingApi,
    fetchBookingsByPropertyId,
    getBookingsByHostApi,
    getBookingsByUserApi,
    updateBookingStatusApi,
} = BookingApis;

const BookingServices = {
    processGetAllBookings: async (params = {}) => {
        try {
            const { listingType, page = 1, limit = 10 } = params;
            const response = await getAllBookingApi(listingType, page, limit);
            return {
                data: response?.data?.data || [],
                pagination: response?.data?.pagination || null,
                total: response?.data?.total || 0
            };
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            } else {
                throw new Error("Unknown error occurred in processGetAllBookings");
            }
        }
    },

    processGetBookingById: async (id) => {
        try {
            const response = await getBookingByIdApi(id);
            return response?.data?.data;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            } else {
                throw new Error("Unknown error occurred in processGetBookingById");
            }
        }
    },

    processDeleteBooking: async (id) => {
        try {
            const response = await deleteBookingApi(id);
            return response?.data;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            } else {
                throw new Error("Unknown error occurred in processDeleteBooking");
            }
        }
    },

    processGetBookingsByProperty: async (propertyId, params = {}) => {
        try {
            const { page = 1, limit = 10 } = params;
            const response = await fetchBookingsByPropertyId(propertyId, page, limit);
            return {
                data: response?.data?.data || [],
                pagination: response?.data?.pagination || null,
                total: response?.data?.total || 0
            };
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            } else {
                throw new Error("Unknown error occurred in processGetBookingsByProperty");
            }
        }
    },

    processGetBookingsByHost: async (hostId, params = {}) => {
        try {
            const { page = 1, limit = 10 } = params;
            const response = await getBookingsByHostApi(hostId, page, limit);
            return {
                data: response?.data?.data || [],
                pagination: response?.data?.pagination || null,
                total: response?.data?.total || 0
            };
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            } else {
                throw new Error("Unknown error occurred in processGetBookingsByHost");
            }
        }
    },

    processGetBookingsByUser: async (userId, params = {}) => {
        try {
            const { page = 1, limit = 10 } = params;
            const response = await getBookingsByUserApi(userId, page, limit);
            return {
                data: response?.data?.data || [],
                pagination: response?.data?.pagination || null,
                total: response?.data?.total || 0
            };
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            } else {
                throw new Error("Unknown error occurred in processGetBookingsByUser");
            }
        }
    },

    processUpdateBookingStatus: async (bookingId, updateData) => {
        try {
            const response = await updateBookingStatusApi(bookingId, updateData);
            return response?.data;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            } else {
                throw new Error("Unknown error occurred in processUpdateBookingStatus");
            }
        }
    },

    // Utility methods for admin dashboard
    processGetBookingStats: async () => {
        try {
            const [allBookings, sellBookings, rentBookings] = await Promise.all([
                getAllBookingApi(null, 1, 1),
                getAllBookingApi('SELL', 1, 1),
                getAllBookingApi('RENT', 1, 1)
            ]);

            return {
                total: allBookings?.data?.total || 0,
                sell: sellBookings?.data?.total || 0,
                rent: rentBookings?.data?.total || 0
            };
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            } else {
                throw new Error("Unknown error occurred in processGetBookingStats");
            }
        }
    },

    processBulkDeleteBookings: async (bookingIds) => {
        try {
            const deletePromises = bookingIds.map(id => deleteBookingApi(id));
            const responses = await Promise.all(deletePromises);
            return {
                success: responses.filter(r => r.status === 200).length,
                failed: responses.filter(r => r.status !== 200).length
            };
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            } else {
                throw new Error("Unknown error occurred in processBulkDeleteBookings");
            }
        }
    },
};

export default BookingServices;
