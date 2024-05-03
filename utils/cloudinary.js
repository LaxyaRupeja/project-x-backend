// import cloudinary from "cloudinary";
import {v2 as cloudinary} from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const cloudUpload = async (filePath, originalName) => {
  console.log(filePath, originalName)
  try {
    //check path
    if(!filePath || !originalName) {
      return null
    }
    const response = await cloudinary.uploader.upload(filePath, {
      folder: "projext-x",
      public_id: originalName,
      original_filename: originalName,
      resource_type: "auto"
    })
    console.log("File successfully uploaded.", response.url)
    fs.unlinkSync(filePath)
    return response;
  } catch (error) {
    console.log(error)
    fs.unlinkSync(filePath)
    return null
  }
}
