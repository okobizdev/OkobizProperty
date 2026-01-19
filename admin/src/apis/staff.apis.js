import axiosClient from "../configs/axios.config";

const StaffManagementApis = {
  createStaff: ({ payload }) => {
    return axiosClient.post(`/admin/create-staff`, payload);
  },
  findAllStaffs: ({ page, role, search }) => {
    return axiosClient.get(
      `/admin/staff?page=${page}&role=${role}&search=${search}`
    );
  },
  changeStaffPassword: ({ id, payload }) => {
    return axiosClient.patch(`/admin/staff/password/${id}`, payload);
  },
  changeStaffRole: ({ id, payload }) => {
    return axiosClient.patch(`/admin/staff/role/${id}`, payload);
  },
  deleteStaff: ({ id }) => {
    return axiosClient.delete(`/admin/staff/${id}`);
  },
};

export default StaffManagementApis;
