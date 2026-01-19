
"use client";
import BookingManagement from "@/components/host-booking-list/Booking";
import useAuth from "@/hooks/useAuth";

export default function BookingReservationPage() {
    const { user } = useAuth();
    if (!user) {
        return <div className="Container py-2 md:py-4">Loading...</div>;
    }
    return (
        <>
            <BookingManagement hostId={user?.userId} />
        </>
    )
}