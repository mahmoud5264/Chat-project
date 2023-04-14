const mongoose = require("mongoose");

const chatSchema = mongoose.Schema(
  {
    chatName: { type: String, trim: true, default: '' },
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    groupAdmins: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    whoCanSend: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    pinnedBy: [{ type: String }],
    whoBlocked: { type: String },
    Image: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema)