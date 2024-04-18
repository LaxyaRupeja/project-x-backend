import express from "express";
import connectDB from "./config/connect.js";
import cors from "cors";
import router from "./routes/user.route.js";

const PORT = 8080;
const app = express();

connectDB();

app.use(express.json());
app.use(cors())

app.use("/user", router);

app.listen(8080, () => {
    console.log(`Server is running on port ${PORT}`);
})