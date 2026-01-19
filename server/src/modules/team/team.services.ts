import path, { join } from "path";
import { ITeamPayload, ITeamUpdateFieldPayload } from "./team.interfaces";
import TeamRepositories from "./team.repositories";
import { promises as fs } from "fs";

const {
  createTeamMember,
  deleteTeamMember,
  findAllTeamMembers,
  updateOneTeamMember,
  updateTeamField,
} = TeamRepositories;

const TeamServices = {
  processCreateTeamMember: async ({
    teamMemberName,
    teamMemberDesignation,
    teamMemberImage,
  }: ITeamPayload) => {
    const filePath = join(
      __dirname,
      "../../../public",
      teamMemberImage as string
    );
    try {
      const data = await createTeamMember({
        teamMemberName,
        teamMemberDesignation,
        teamMemberImage: `/public/${teamMemberImage}`,
      });

      if (!data) {
        try {
          await fs.unlink(filePath);
          throw new Error("Image Uploading Failed");
        } catch (error) {
          throw error;
        }
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        await fs.unlink(filePath);
        throw error;
      } else {
        await fs.unlink(filePath);
        throw new Error("Unknown Error Occurred In create team member service");
      }
    }
  },
  processUpdateTeamField: async (payload: ITeamUpdateFieldPayload) => {
    try {
      const data = await updateTeamField(payload);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Error Occurred In update team field service");
      }
    }
  },
  processRetrieveAllTeamMembers: async () => {
    try {
      const data = await findAllTeamMembers();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(
          "Unknown Error Occurred In retrieve team member service"
        );
      }
    }
  },
  processUpdateTeamMember: async ({
    teamMemberDesignation,
    teamMemberId,
    teamMemberName,
    teamMemberImage,
    teamMemberOldImage,
  }: ITeamPayload) => {
    const image = teamMemberOldImage as string;
    const relativeImagePath = path.basename(image);
    const oldFilePath = join(__dirname, "../../../public", relativeImagePath);
    const newImageFilePath = join(
      __dirname,
      "../../../public",
      teamMemberImage as string
    );
    try {
      const updatedData = await updateOneTeamMember({
        teamMemberDesignation,
        teamMemberId,
        teamMemberImage: `/public/${teamMemberImage}`,
        teamMemberName,
      });
      if (!updatedData) {
        fs.unlink(newImageFilePath);
      }
      fs.unlink(oldFilePath);
      return updatedData;
    } catch (error) {
      if (error instanceof Error) {
        fs.unlink(newImageFilePath);
        throw error;
      } else {
        fs.unlink(newImageFilePath);
        throw new Error("Unknown Error Occurred In delete team member service");
      }
    }
  },
  processDeleteTeamMember: async ({
    teamMemberId,
    teamMemberImage,
  }: ITeamPayload) => {
    const image = teamMemberImage as string;
    const relativeImagePath = image.replace("/public/", "");
    const filePath = join(__dirname, "../../../public", relativeImagePath);

    try {
      await deleteTeamMember({ teamMemberId });
      await fs.unlink(filePath);
      return;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Error Occurred In delete team member service");
      }
    }
  },
};

export default TeamServices;
