import Handlebars from "handlebars";
import mailTransporter from "../configs/nodemailer.configs";
import mailOption from "./mailOption.utils";
import { verificationEmailTemplate } from "../templates/verificationEmailTemplate";
import { IVerificationEmailData } from "../interfaces/verificationEmailData.interfaces";
const CLIENT_BASE_URL = process.env.CLIENT_BASE_URL || "https://okobiz.com"; 
const sendVerificationEmail = async (data: IVerificationEmailData) => {
  try {
    const template = Handlebars.compile(verificationEmailTemplate);
    const verificationLink = `${CLIENT_BASE_URL}/email-verification?email=${data.email}`;
    // const personalizedTemplate = template(data);
    const personalizedTemplate = template({
      ...data,
      baseUrl: CLIENT_BASE_URL,
      verificationLink,
    });
    await mailTransporter.sendMail(
      mailOption(
        data.email,
        "Email Verification Required",
        personalizedTemplate
      )
    );
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
};

export default sendVerificationEmail;
