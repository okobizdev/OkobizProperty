import axiosClient from "../configs/axios.config";

const teamMemberApis = {
  getTeamMembersApi: () => {
    return axiosClient.get("/admin/team");
  },

  addTeamMemberApi: (payload) => {
    return axiosClient.post("/admin/team", payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  editTeamMemberApi: (payload, id) => {
    return axiosClient.put(`/admin/team/${id}`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  editTeamMemberFieldApi: (payload, id) => {
    return axiosClient.patch(`/admin/team/${id}`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  deleteTeamMemberApi: (id) => {
    return axiosClient.delete(`/admin/team/${id}`);
  },
};

export default teamMemberApis;
