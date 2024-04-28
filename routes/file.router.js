import express from "express";
// import Form from "../models/form.model.js";
import { uploadFile } from "../middlewares/fileUpload.js";

const fileRouter = express.Router();

fileRouter.post("/", uploadFile);

export default fileRouter;
