// models/User.js
import mongoose, { Schema, models } from "mongoose";
const userSchema = new mongoose.Schema({
  userId: { type: Number, required: true, unique: true },
  joinedAt: { type: Date, default: Date.now },
  premium: { type: Boolean, default: false,required: true },
  premiumUntil: { type: Date, default: null },
});

// Prevent model overwrite upon hot reload
const User = models.LatestRoseBotUser || mongoose.model("LatestRoseBotUser", userSchema);

export default User;