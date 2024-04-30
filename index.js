import express from "express";
import connectDB from "./config/connect.js";
import cors from "cors";
import router from "./routes/user.route.js";
import formRouter from "./routes/form.router.js";
import fileRouter from "./routes/file.router.js";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
dotenv.config();


const PORT = 8080;
const app = express();



connectDB();

// Initializing transporter so it will be generated only once and should not cause any issue 
export const transporter = nodemailer.createTransport({
    service: process.env.NODEMAILER_SERVICE,
    auth: {
      user: process.env.NODEMAILER_USER, // your Gmail username
      pass: process.env.NODEMAILER_PASS // your Gmail password
    }
});

app.use(express.json());
app.use(cors())

app.use("/user", router);
app.use("/forms", formRouter);
app.use("/files", fileRouter);

app.listen(8080, () => {
    console.log(`Server is running on port ${PORT}`);
})