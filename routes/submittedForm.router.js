import express from "express";
import SubmittedForm from "../models/submittedForm.model.js";

const submittedFormRouter = express.Router();

// paginate this route
submittedFormRouter.get("/", async (req, res) => {
    const title = req.query.title || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    try {
        // Find matching users based on the name and pagination parameters
        const formsQuery = SubmittedForm.find({ title: { $regex: title, $options: "i" } })
            .populate("author")
            .skip((page - 1) * limit)
            .limit(limit);

        // Execute the query to get the users
        const forms = await formsQuery.exec();

        // Get the total count of documents without pagination
        const totalCount = await SubmittedForm.countDocuments({ title: { $regex: title, $options: "i" } });

        // Return the users and the total count
        res.json({ forms, totalCount });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

submittedFormRouter.get("/:id", async (req, res) => {
    const { id } = req.params
    console.log(id)
    try {
        // Execute the query to get the users
        const form = await SubmittedForm.findById(id).populate("author");

        // Return the users and the total count
        res.json({ form });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

submittedFormRouter.post("/", async (req, res) => {
    try {
        const newForm = await SubmittedForm.create(req.body)
        res.status(201).json(newForm);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default submittedFormRouter;
