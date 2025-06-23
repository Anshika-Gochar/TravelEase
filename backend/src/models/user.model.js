import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Minimum 6 characters required"],
    },
    avatar: {
      type: String,
      default: "", // or set to default profile image URL
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    groups: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group", // Assuming there will be a Group model later
      },
    ],
    resetToken: String,
    resetTokenExpire: Date,
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Match user password during login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
