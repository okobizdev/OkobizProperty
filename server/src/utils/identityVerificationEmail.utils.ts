import mailTransporter from "../configs/nodemailer.configs";
import {
  accountSuspendedEmailSubject,
  approvedEmailSubject,
  rejectionEmailSubject,
} from "../const";
import { IIdentityVerificationEmailData } from "../interfaces/identityVerificationEmail.interface";
import { accountSuspendedEmailTemplate } from "../templates/accountSuspendedEmailTemplate";
import { identityVerificationApprovedEmailTemplate } from "../templates/identityVerificationApprovedEmailTemplate";
import { identityVerificationRejectionEmailTemplate } from "../templates/identityVerificationRejectionEmailTemplate";
import mailOption from "./mailOption.utils";
import Handlebars from "handlebars";

const IdentityVerificationUtils = {
  sendRejectionEmailUtils: async ({
    name,
    email,
  }: IIdentityVerificationEmailData) => {
    try {
      const template = Handlebars.compile(
        identityVerificationRejectionEmailTemplate
      );
      const personalizedTemplate = template({ name });
      await mailTransporter.sendMail(
        mailOption(email, rejectionEmailSubject, personalizedTemplate)
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  },
  sendApprovedEmailUtils: async ({
    name,
    email,
  }: IIdentityVerificationEmailData) => {
    try {
      const template = Handlebars.compile(
        identityVerificationApprovedEmailTemplate
      );
      const personalizedTemplate = template({ name });
      await mailTransporter.sendMail(
        mailOption(email, approvedEmailSubject, personalizedTemplate)
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  },
  sendSuspendedEmailUtils: async ({
    name,
    email,
  }: IIdentityVerificationEmailData) => {
    try {
      const template = Handlebars.compile(accountSuspendedEmailTemplate);
      const personalizedTemplate = template({ name });
      await mailTransporter.sendMail(
        mailOption(email, accountSuspendedEmailSubject, personalizedTemplate)
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  },
};

export default IdentityVerificationUtils;
