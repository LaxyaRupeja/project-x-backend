import express from "express";
import User from "../models/user.model.js";

const router = express.Router();

// paginate this route
router.get("/", async (req, res) => {
    const name = req.query.name || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    try {

        const users = await User.find({ name: { $regex: name, $options: "i" } }).skip((page - 1) * limit)
            .limit(limit);

        res.json({ users });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

router.post("/", async (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        role: req.body.role,
        password: req.body.password
    });
    try {
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


router.patch("/changeRole/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        user.role = req.body.role;
        const updatedUser = await user.save();
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})



export default router;