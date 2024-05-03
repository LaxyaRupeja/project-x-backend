import express from "express";
import User from "../models/user.model.js";
import otpGenerator from "otp-generator";
import sendEmail from "../utils/sendEmail.js";

const router = express.Router();

// paginate this route
router.get("/", async (req, res) => {
    const name = req.query.name || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    try {
        // Find matching users based on the name and pagination parameters
        const usersQuery = User.find({ name: { $regex: name, $options: "i" } })
            .skip((page - 1) * limit)
            .limit(limit);

        // Execute the query to get the users
        const users = await usersQuery.exec();

        // Get the total count of documents without pagination
        const totalCount = await User.countDocuments({ name: { $regex: name, $options: "i" } });

        // Return the users and the total count
        res.json({ users, totalCount });
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


router.patch("/editUser/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        user.role = req.body.role;
        user.password = req.body.newPassword
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


router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).send({message:'User not found'});
    }
    
    // Generate OTP
    const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false,lowerCaseAlphabets:false });
    user.otp = otp;
    user.otpExpires = Date.now() + 600000; // Expires in 10 minutes
    user.otpVerified = false; // Set OTP verification flag to false
    await user.save();
    
    sendEmail(email,'OTP Verification for Reset Password' ,`Your OTP is: ${otp}`).then(() => {
        res.send({message:'OTP sent successfully'});
    }).catch(error => {
        console.error('Failed to send email:', error);
        res.status(500).send({message:'Failed to send OTP'});
    });
});

router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).send({message:'User not found'});
    }
    if (user.otp !== otp || user.otpExpires < Date.now()) {
        return res.status(400).send({message:'Invalid or expired OTP'});
    }
    
    // Set OTP verification flag to true
    user.otpVerified = true;
    await user.save();
    
    res.send({message:'OTP verified successfully'});
});

router.post('/reset-password', async (req, res) => {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).send({message:'User not found'});
    }
    
    // Check if OTP has been verified
    if (!user.otpVerified) {
        return res.status(400).send({message:'OTP verification required before resetting password'});
    }
    
    // Reset password
    user.password = newPassword;
    user.otp = undefined;
    user.otpExpires = undefined;
    user.otpVerified = false; // Reset OTP verification flag
    await user.save();
    
    res.send({message:'Password reset successfully'});
});



export default router;
