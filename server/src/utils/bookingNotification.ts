import Handlebars from "handlebars";
import mailTransporter from "../configs/nodemailer.configs";
import mailOption from "./mailOption.utils";
import { bookingConfirmationTemplate }  from "../templates/bookingConfirmationTemplate"

const CLIENT_BASE_URL = process.env.CLIENT_BASE_URL || "https://okobiz.com"; 
const sendBookingConfirmMail = async (data: any) => {
  try {
    const template = Handlebars.compile(bookingConfirmationTemplate);
    
    const personalizedTemplate = template({
      ...data,
      baseUrl: CLIENT_BASE_URL,
    });
    await mailTransporter.sendMail(
      mailOption(
        process.env.SMTP_USER || "dev.okobiz@gmail.com",
        "Booking Information",
        personalizedTemplate
      )
    );
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
};

export default sendBookingConfirmMail;
