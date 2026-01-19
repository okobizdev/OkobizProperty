import { ITeamPayload, ITeamUpdateFieldPayload } from "./team.interfaces";
import Team from "./team.models";

const TeamRepositories = {
  createTeamMember: async (payload: ITeamPayload) => {
    try {
      const newTeamMember = new Team(payload);
      await newTeamMember.save();
      return newTeamMember;
    } catch (error) {
      throw new Error(
        "Unknown Error Occurred In Team Member Creation Operation"
      );
    }
  },
  updateTeamField: async ({
    payload,
    teamMemberId,
  }: ITeamUpdateFieldPayload) => {
    try {
      const data = await Team.findByIdAndUpdate(teamMemberId, payload, {
        new: true,
      });
      return data;
    } catch (error) {
      throw new Error(
        "Unknown Error Occurred In Team Member Retrieve Operation"
      );
    }
  },
  findAllTeamMembers: async () => {
    try {
      const data = await Team.find({});
      return data;
    } catch (error) {
      throw new Error(
        "Unknown Error Occurred In Team Member Retrieve Operation"
      );
    }
  },
  updateOneTeamMember: async ({
    teamMemberId,
    teamMemberDesignation,
    teamMemberImage,
    teamMemberName,
  }: ITeamPayload) => {
    try {
      const data = await Team.findByIdAndUpdate(
        teamMemberId,
        {
          $set: { teamMemberDesignation, teamMemberImage, teamMemberName },
        },
        { new: true }
      );
      return data;
    } catch (error) {
      throw new Error("Unknown Error Occurred In Team Member update Operation");
    }
  },
  deleteTeamMember: async ({ teamMemberId }: ITeamPayload) => {
    try {
      const deletedData = await Team.findByIdAndDelete(teamMemberId);
      if (!deletedData) throw new Error("Team Member delete failed");
      return;
    } catch (error) {
      throw new Error("Unknown Error Occurred In Team Member Delete Operation");
    }
  },
  findOneTeamMember: async ({ teamMemberId }: ITeamPayload) => {
    try {
      const data = await Team.findById(teamMemberId);
      return data;
    } catch (error) {
      throw new Error("Unknown Error Occurred In Team Member Delete Operation");
    }
  },
};

export default TeamRepositories;
