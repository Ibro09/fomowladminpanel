// models/User.js
import mongoose, { models } from "mongoose";
const groupSchema = new mongoose.Schema({
  groupId: { type: String, required: true, unique: true },
  userId: { type: Number, required: true },
  bannedWords: { type: [String], default: [] },
  isWelcome: { type: Boolean, default: false },
  welcomeMessage: { type: String, default: "" },
  isGoodbye: { type: Boolean, default: true },
  goodbyeMessage: { type: String, default: "" },
  spam:{type: Boolean, default: false},
  joinedAt: { type: Date, default: Date.now },
  welcomePhotoId: { type: String, default: null },
  // Add these fields if not present
goodbyePhotoId: { type: String, default: null },
});

// Prevent model overwrite upon hot reload
const Group = models.LatestRoseBotGroup || mongoose.model("LatestRoseBotGroup", groupSchema);

export default Group;
// export default mongoose.model("LatestRoseBotGroup", groupSchema);

  