import { apiBaseUrl } from "@/config/config";

export const getBookingById = async (id: any) => {
    try {
        const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
        const res = await fetch(`${apiBaseUrl}/bookings/property/${id}`, {
            cache: "no-store",
            headers: {
                'Content-Type': 'application/json',
                ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {})
            }
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        return res.json();
    } catch (error) {
        console.error('Error fetching booking:', error);
        throw error;
    }

};
export const getAllhostReservations = async (hostId: string) => {
    try {
        const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
        const res = await fetch(`${apiBaseUrl}/bookings/host/${hostId}`, {
            cache: "no-store",
            headers: {
                'Content-Type': 'application/json',
                ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {})
            }
        });
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        return res.json();
    } catch (error) {
        console.error("Error fetching host reservations:", error);
        throw error;
    }
}