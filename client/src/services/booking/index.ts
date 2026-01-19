import axiosClient from "@/lib/axios.config";

export const BookingServices = {
  createBooking: async (bookingData: any) => {
  try {
    let payload: FormData | any;
    let headers: Record<string, string> = {};

    // If already FormData (contains files), keep as FormData
    if (bookingData instanceof FormData) {
      payload = bookingData;
      headers = {
        "Content-Type": "multipart/form-data",
      };
    } else {
      // Check if bookingData contains any File objects
      const hasFiles = Object.values(bookingData).some(
        value => value instanceof File || value instanceof Blob
      );

      if (hasFiles) {
        // Convert to FormData for file upload
        payload = new FormData();
        Object.entries(bookingData).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            // Handle objects (like client) by stringifying
            if (typeof value === 'object' && !(value instanceof File) && !(value instanceof Blob)) {
              payload.append(key, JSON.stringify(value));
            } else {
              payload.append(key, value as any);
            }
          }
        });
        headers = {
          "Content-Type": "multipart/form-data",
        };
      } else {
        // No files, send as JSON
        payload = bookingData;
        headers = {
          "Content-Type": "application/json",
        };
      }
    }

    const response = await axiosClient.post("/bookings", payload, {
      headers,
    });

    return response;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
},

  getBookingsByPropertyId: async (propertyId: string) => {
    try {
      const response = await axiosClient.get(
        `/bookings/property/${propertyId}`
      );
      return response.data as { data: any[] };
    } catch (error) {
      console.error("Error fetching bookings for property:", error);
      throw error;
    }
  },
  getBookingsByUserId: async (
    userId: string,
    params?: { page?: number; limit?: number }
  ) => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());

      const url = `/bookings/user/${userId}${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;
      const response = await axiosClient.get(url);
      return response.data as {
        data: any[];
        pagination?: {
          currentPage: number;
          totalPages: number;
          totalItems: number;
          hasNext: boolean;
          hasPrev: boolean;
        };
      };
    } catch (error) {
      console.error("Error fetching bookings for user:", error);
      throw error;
    }
  },
};
