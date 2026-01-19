

// import BookingManagement from "@/components/host-booking-list/Booking";
import PropertyManager from "@/components/properties/PropertyManager";


const HostDashBoard = () => {

  return (
    <div className="Container py-2 md:py-4">
      {/* <BookingManagement hostId={user?.userId} /> */}
      <PropertyManager />
    </div>
  );
};
export default HostDashBoard;
