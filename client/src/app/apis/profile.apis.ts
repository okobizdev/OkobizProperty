import axiosClient from "@/lib/axios.config";

const ProfileApis = {
  getProfileApi: () => {
    return axiosClient.get("/profile");
  },
  getSslSuccessApi: (bookingId: string) => {
    return axiosClient.get(`/rent/bookings/${bookingId}`);
  }
};

export default ProfileApis;
