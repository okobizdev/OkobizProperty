import axiosClient from "../configs/axios.config";

const HostManagementApis = {
  getAllHosts: (accountStaus, page, sort) => {
    return axiosClient.get(
      `/admin/users?role=host&accountStatus=${accountStaus}&sort=${sort}&page=${page}`
    );
  },
  changeAccountStatus: (id, payload) => {
    return axiosClient.patch(`/admin/users/${id}`, payload);
  },
  deleteAnUser: (id) => {
    return axiosClient.delete(`/admin/users/${id}`);
  },
  searchHost: (user) => {
    return axiosClient.get(`/admin/search/users?role=host&user=${user}`);
  },
};

export default HostManagementApis;
