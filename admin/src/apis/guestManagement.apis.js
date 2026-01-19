import axiosClient from "../configs/axios.config";

const GuestManagementApis = {
  getAllGuests: (accountStatus, page, sort) => {
    return axiosClient.get(
      `/admin/users?role=guest&accountStatus=${accountStatus}&sort=${sort}&page=${page}`
    );
  },
  changeAccountStatus: (id, payload) => {
    return axiosClient.patch(`/admin/users/${id}`, payload);
  },
  deleteAnUser: (id) => {
    return axiosClient.delete(`/admin/users/${id}`);
  },
  searchGuest: (user) => {
    return axiosClient.get(`/admin/search/users?role=guest&user=${user}`);
  },
};

export default GuestManagementApis;
