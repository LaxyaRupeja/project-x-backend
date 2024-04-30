import dotenv from "dotenv";
import { transporter } from "../index.js";
dotenv.config();

async function sendEmail(recipient, subject, message) {
    try {
      // Define email option
      let mailOptions = {
        from: process.env.NODEMAILER_USER,
        to: recipient,
        subject: subject,
        text: message
      };
  
      // Send email
      let info = await transporter.sendMail(mailOptions);
  
      console.log('Email sent: ' + info.response);
    } catch (error) {
      console.error('Error occurred:', error);
    }
}


export default sendEmail;