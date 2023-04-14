const mongoose = require("mongoose");
 
const messageSchema = mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    content: { type: String, trim: true },
    file: { type: String, default: "" },
    whoCanSee: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    chatId: String,
  },
  { timestamps: true }
);
const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
