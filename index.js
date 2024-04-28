import express from "express";
import connectDB from "./config/connect.js";
import cors from "cors";
import router from "./routes/user.route.js";
import formRouter from "./routes/form.router.js";
import fileRouter from "./routes/file.router.js";

const PORT = 8080;
const app = express();

connectDB();

app.use(express.json());
app.use(cors())

app.use("/user", router);
app.use("/forms", formRouter);
app.use("/files", fileRouter);

app.listen(8080, () => {
    console.log(`Server is running on port ${PORT}`);
})