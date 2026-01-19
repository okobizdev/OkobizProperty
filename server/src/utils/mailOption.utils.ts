import { IMailOption } from "../interfaces/mailOption.interfaces";

const mailOption = (to: string, subject: string, html: string): IMailOption => {
  const option: IMailOption = {
    from: process.env.SMTP_USER as string,
    to,
    subject,
    html,
  };
  return option;
};

export default mailOption;
