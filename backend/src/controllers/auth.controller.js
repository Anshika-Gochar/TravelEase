import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

// Helper to generate JWT
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
};

//  Signup Controller
export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: "Email already in use" });
        }

        const user = await User.create({ name, email, password });
        const token = generateToken(user._id);

        // Set cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "development",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(201).json({
            message: "Signup successful",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
            },
        });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

//  Login Controller
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = generateToken(user._id);

        // Set cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "development",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            message: "Login successful",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
            },
        });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

//logout 
export const logout = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });
    res.status(200).json({ message: "Logout successful" });
};



// Update profile
export const updateProfile = async (req, res) => {
    console.log("Request body:", req.body);

    console.log("Authenticated user:", req.user);
    try {


        const { name, email, avatar } = req.body || {};
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (name) user.name = name;

        // check if new email already exists
        if (email && email !== user.email) {
            const emailTaken = await User.findOne({ email });
            if (emailTaken) {
                return res.status(400).json({ message: "Email already in use" });
            }
            user.email = email;
        }
        if (avatar) user.avatar = avatar; // later: use Cloudinary upload

        await user.save();
        res.status(200).json({
            message: "Profile updated",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
            },
        });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// Delete profile
export const deleteProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: "User not found" });

        await User.findByIdAndDelete(req.user._id);
        res.clearCookie("token"); // optional logout
        res.status(200).json({ message: "Account deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};
