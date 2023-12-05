import dotenv from "dotenv";
dotenv.config();

export const mailConfig = {
  service: process.env.SERVICE_NAME,
  host: process.env.HOST,
  port: Number(process.env.MAIL_PORT),
  secure: process.env.IS_SECURED === "true"? true: false,
  user: process.env.EMAIL,
  pass: process.env.APP_PASS,
};
