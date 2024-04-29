import multer from "multer";
import { serverUpload } from "./multer.js";
import { cloudUpload } from "../utils/cloudinary.js";

//middleware
// export const uploadImage = (req, res, next) => {
//   serverUpload.single("file")(req, res, async (err) => {
//     try {
//       if (err instanceof multer.MulterError) {
//         return res
//           .status(400)
//           .send({ message: `Multer Error occurred: ${err.message}` });
//       } else if (err) {
//         return res
//           .status(500)
//           .send({ message: `An unexpected error occurred: ${err.message}` });
//       }

//       const file = req.file;
//       if (!file) {
//         res.status(400).send({ message: `Please upload a file.` });
//     }

//     const response = await cloudUpload(file.path);
//     if (!response) {
//         res.status(400).send({ message: `Failed to upload the file.` });
//       }
//       console.log("file successfully uploaded")
//       req.file = response;
//       next();
//     } catch (error) {
//       next(error);
//     }
//   });
// };

//controller
export const uploadFile = (req, res) => {
  serverUpload.single("file")(req, res, async (err) => {
    console.log(req.file);
    try {
      if (err instanceof multer.MulterError) {
        return res
          .status(400)
          .send({ message: `Multer Error occurred: ${err.message}` });
      } else if (err) {
        return res
          .status(500)
          .send({ message: `An unexpected error occurred: ${err.message}` });
      }

      const file = req.file;
      if (!file) {
        res.status(400).send({ message: `Please upload a file.` });
      }

      const response = await cloudUpload(file.path, file.originalname);
      if (!response) {
        return res.status(400).send({ message: `Failed to upload the file.` });
      }
      console.log("file successfully uploaded");
      //   req.file = response;
      return res.status(201).send({
        status: "Success",
        file: response,
      });
    } catch (error) {
      return res.send({
        status: "Failure",
        error: error,
      });
    }
  });
};
