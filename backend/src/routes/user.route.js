import express from "express";
import { signup, login, logout ,updateProfile,deleteProfile } from "../controllers/auth.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", isAuthenticated, (req, res) => {
  res.status(200).json({ user: req.user });
});
router.put("/profile", isAuthenticated, updateProfile);
router.delete("/profile", deleteProfile);

export default router;