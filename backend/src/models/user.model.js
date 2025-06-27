import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: "Please enter a valid email",
    },
  },
  password: {
    type: String,
  },
  googleId: {
    type: String,
  },
  avatar: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    default: "user",
  },
  groups: {
    type: [String],
    default: [],
  },
}, { timestamps: true });

const User = mongoose.model("User", userSchema,"users");
export default User;
