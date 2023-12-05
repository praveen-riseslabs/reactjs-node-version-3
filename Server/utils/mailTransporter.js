import nodemailer from "nodemailer";
import { mailConfig } from "./credentials.js";

export const mailTransporter = nodemailer.createTransport({
  service: mailConfig.service,
  host: mailConfig.host,
  port: mailConfig.port,
  secure: mailConfig.secure,
  auth: {
    user: mailConfig.user,
    pass: mailConfig.pass,
  },
});

export const sendMail = async (transporter, mailOptions) => {
  try {
    await transporter.sendMail(mailOptions);
    console.log("mail has been sent");
  } catch (err) {
    console.log(err);
  }
};
