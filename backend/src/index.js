import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import session from "express-session";
import passport from "passport";
import "./passport.js";

import userRoutes from "./routes/user.route.js";
import googleAuthRoutes from "./routes/googleAuth.route.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Session and Passport setup BEFORE routes
app.use(session({
  secret: 'yourSecretKey', // Can be your JWT_SECRET or any random string
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// ✅ Routes
app.use("/api/auth/", userRoutes);
app.use("/api/auth/google", googleAuthRoutes);

const PORT = process.env.PORT;

console.log("MongoDB URI:", process.env.MONGO_URI);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => console.log("MongoDB connection error:", err));
