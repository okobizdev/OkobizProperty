import axiosClient from "@/lib/axios.config";
import { Booking as BookingType } from "@/types/BookingsTypes";

// API response interface (what the server actually returns)
interface ApiBookingResponse {
  _id: string;
  userId: any; // Could be string or populated User object
  propertyId: any; // Could be string or populated Property object
  checkInDate: string | null;
  checkOutDate: string | null;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  paymentId: string | null;
}

export interface Property {
  _id: string;
  title: string;
  host: string;
}

export interface Booking {
  _id: string;
  userId: string;
  propertyId: Property | string; // Allow propertyId to be either a string or a populated object
  checkInDate: Date | null;
  checkOutDate: Date | null;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  paymentId: string | null;
}

export async function createBooking(data: Booking): Promise<Booking> {
  const response = await axiosClient.post("/bookings", data);
  return response.data as Booking;
}

export async function deleteBooking(id: string): Promise<{ message: string }> {
  const response = await axiosClient.delete<{ message: string }>(
    `/bookings/${id}`
  );
  return response.data;
}

export async function getBookingByPropertyId(
  propertyId: string
): Promise<Booking[]> {
  const response = await axiosClient.get<Booking[]>(
    `/bookings/property/${propertyId}`
  );
  return response.data;
}

export async function getBookingByHostId(hostId: string): Promise<Booking[]> {
  const response = await axiosClient.get<Booking[]>(`/bookings/host/${hostId}`);
  return response.data;
}

export async function getBookingByUserId(
  userId: string
): Promise<BookingType[]> {
  const response = await axiosClient.get<{ data: ApiBookingResponse[] }>(
    `/bookings/user/${userId}`
  );
  // Transform the API response to match our BookingType interface
  return response.data.data.map(
    (booking: ApiBookingResponse): BookingType => ({
      _id: booking._id,
      userId: booking.userId, // This will be a populated User object
      propertyId: booking.propertyId, // This will be a populated Property object
      checkInDate: booking.checkInDate,
      checkOutDate: booking.checkOutDate,
      status: booking.status,
      paymentMethod: booking.paymentMethod,
      paymentStatus: booking.paymentStatus,
      paymentId: booking.paymentId,
    })
  );
}
