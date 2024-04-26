import express from "express";
import Form from "../models/form.model.js";

const formRouter = express.Router();

// paginate this route
formRouter.get("/", async (req, res) => {
    const title = req.query.title || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    try {
        // Find matching users based on the name and pagination parameters
        const formsQuery = Form.find({ title: { $regex: title, $options: "i" } })
            .skip((page - 1) * limit)
            .limit(limit);

        // Execute the query to get the users
        const forms = await formsQuery.exec();

        // Get the total count of documents without pagination
        const totalCount = await Form.countDocuments({ title: { $regex: title, $options: "i" } });

        // Return the users and the total count
        res.json({ forms, totalCount });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

formRouter.get("/:id", async (req, res) => {
    const { id } = req.params
    console.log(id)
    try {
        // Execute the query to get the users
        const form = await Form.findById(id);

        // Return the users and the total count
        res.json({ form });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

formRouter.post("/", async (req, res) => {
    console.log(req.body);
    try {
        const newForm = await Form.create(req.body)
        res.status(201).json(newForm);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default formRouter;
