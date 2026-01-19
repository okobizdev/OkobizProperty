import React from "react";
import Link from "next/link";

const BookingButton = ({ userId }: { userId: string }) => {
  return (
    <Link href={`/my-bookings/${userId}`}>
      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        View My Bookings
      </button>
    </Link>
  );
};

export default BookingButton;
