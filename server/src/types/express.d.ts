import { TokenPayload } from "../interfaces/jwtPayload.interfaces";
import { IAmenitiesPayload } from "../modules/amenities/amenities.interfaces";
import { IBlogPayload } from "../modules/blog/blog.interfaces";
import IPartner from "../modules/partner/partner.interfaces";
import ITeam from "../modules/team/team.interfaces";
import { IUser } from "../modules/user/user.interfaces";
import { IWhyChooseUsPayload } from '../modules/whyChooseUs/whyChooseUs.interfaces';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      authenticateTokenDecoded: TokenPayload;
      teamMember?: ITeam;
      partner?: IPartner;
      blog?: IBlogPayload;
      amenities?: IAmenitiesPayload;
      whyChooseUs?:IWhyChooseUsPayload
    }
  }
}
