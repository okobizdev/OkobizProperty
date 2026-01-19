import { Document, Types } from "mongoose";

interface ITeam {
  teamMemberName?: string;
  teamMemberDesignation?: string;
  teamMemberImage?: string;
}

export interface ITeamUpdateFieldPayload {
  payload?: ITeam;
  teamMemberId?: Types.ObjectId;
}

export interface ITeamPayload {
  teamMemberName?: string;
  teamMemberDesignation?: string;
  teamMemberImage?: string;
  teamMemberId?: Types.ObjectId;
  teamMemberOldImage?: string;
}

export default ITeam;
