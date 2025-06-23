import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const isAuthenticated = async (req, res, next) => {

    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        console.log("Token:", token);
        console.log("Decoded:", decoded);
        console.log("User found:", user?.name);
        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
};
