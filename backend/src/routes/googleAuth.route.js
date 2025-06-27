import express from "express";
import passport from "passport";

const router = express.Router();

router.get("/", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.send("Google Authentication Successful. User saved in MongoDB!");
  }
);

export default router;
