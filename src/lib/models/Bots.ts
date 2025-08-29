import mongoose, { models } from "mongoose";
const BotSchema = new mongoose.Schema({
  ownerId: {
    type: Number,
    required: true,
  },
  botId: {
    type: Number,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// module.exports = mongoose.model("createdBots", BotSchema);
// export default mongoose.model("createdBots", BotSchema);

// Prevent model overwrite upon hot reload
const Bots = models.createdBots || mongoose.model("createdBots", BotSchema);

export default Bots;