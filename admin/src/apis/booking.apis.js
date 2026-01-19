import axiosClient from "../configs/axios.config";

const BookingApis = {
    getAllBookingApi: (listingType, page = 1, limit = 1000) => {
        let url = "/bookings";
        const params = new URLSearchParams();
        
        if (listingType) {
            params.append("listingType", listingType);
        }
        if (page) {
            params.append("page", page.toString());
        }
        if (limit) {
            params.append("limit", limit.toString());
        }
        
        const queryString = params.toString();
        if (queryString) {
            url += `?${queryString}`;
        }
        
        return axiosClient.get(url);
    },

    getBookingByIdApi: (id) => {
        return axiosClient.get(`/bookings/${id}`);
    },

    deleteBookingApi: (id) => {
        return axiosClient.delete(`/bookings/${id}`);
    },

    fetchBookingsByPropertyId: (id, page = 1, limit = 10000) => {
        return axiosClient.get(`/bookings/property/${id}`, { 
            params: { page, limit } 
        });
    },

    getBookingsByHostApi: (hostId, page = 1, limit = 10000) => {
        return axiosClient.get(`/bookings/host/${hostId}`, { 
            params: { page, limit } 
        });
    },

    getBookingsByUserApi: (userId, page = 1, limit = 10000) => {
        return axiosClient.get(`/bookings/user/${userId}`, { 
            params: { page, limit } 
        });
    },

    updateBookingStatusApi: (bookingId, updateData) => {
        return axiosClient.put(`/bookings/${bookingId}`, updateData);
    },
};

export default BookingApis;
