import TeamMemberApis from "../apis/teamMember.apis";

const {
  getTeamMembersApi,
  addTeamMemberApi,
  editTeamMemberApi,
  deleteTeamMemberApi,
  editTeamMemberFieldApi,
} = TeamMemberApis;

const TeamMemberServices = {
  processGetTeamMembers: async () => {
    try {
      const response = await getTeamMembersApi();
      return response?.data?.data;
    } catch (error) {
      if (error instanceof Error) throw error;
      else throw new Error("Unknown error occurred in processGetTeamMembers");
    }
  },

  processAddTeamMember: async (payload) => {
    try {
      const response = await addTeamMemberApi(payload);
      return response?.data;
    } catch (error) {
      if (error instanceof Error) throw error;
      else throw new Error("Unknown error occurred in processAddTeamMember");
    }
  },

  processEditTeamMember: async (payload, id) => {
    try {
      const response = await editTeamMemberApi(payload, id);
      return response?.data;
    } catch (error) {
      if (error instanceof Error) throw error;
      else throw new Error("Unknown error occurred in processEditTeamMember");
    }
  },
  processEditTeamMemberField: async (payload, id) => {
    try {
      const response = await editTeamMemberFieldApi(payload, id);
      return response?.data;
    } catch (error) {
      if (error instanceof Error) throw error;
      else throw new Error("Unknown error occurred in processEditTeamMember");
    }
  },
  processDeleteTeamMember: async (id) => {
    try {
      const response = await deleteTeamMemberApi(id);
      return response?.data;
    } catch (error) {
      if (error instanceof Error) throw error;
      else throw new Error("Unknown error occurred in processDeleteTeamMember");
    }
  },
};

export default TeamMemberServices;
