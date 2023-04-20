const Message = require("../models/messageModel");
const Chat = require("../models/chatModel");
const mongoose = require("mongoose");


exports.sendMessage = async (req, res) => {
    const { content, chatId } = req.body;
    let whoCanSee = req.body.whoCanSee?.split(',')
  
    let resualt = await Message.create({
      sender: req.user._id,
      content: content,
      chat: chatId,
      chatId: chatId,
      file: req.file?.filename,
      whoCanSee: whoCanSee,
      readBy: req.user._id
    });
    await Chat.findByIdAndUpdate(chatId, { latestMessage: resualt._id });
    res.status(200).json(resualt);
  };
  
  
  exports.editMessage = async (req, res) => {
    let id = req.body.id;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json("Message not found")
    const message = await Message.findById(id)
    if (!message) return res.status(404).json("Message not found")
    if (String(message.sender) !== String(req.user._id)) return res.status(402).json("Can not delete others' messages")
    await Message.findByIdAndUpdate(id, { content: req.body.content });
    res.status(200).json("message updated ");
  };
exports.allMessages = async (req, res) => {
  console.log(req.user._id);
  if (mongoose.Types.ObjectId.isValid(req.params.chatId)) {

    let updated = await Message.updateMany(
      {
        chat: req.params.chatId,
        readBy: {$not:{ $elemMatch: { $eq: req.user._id } }},
      },
      { $addToSet: { readBy: req.user._id } }
    );
    let messages = await Message.find({
      chat: req.params.chatId,
      whoCanSee: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("sender", "firstname image email")
      .populate("chat")
      .populate("whoCanSee", "_id");
    res.status(200).json(messages);
  } else res.status(400).json("No such chat");
};



exports.deleteChatMessages = async (req, res) => {
  let x = await Message.updateMany(
    { chatId: req.body.id },
    { $pull: { whoCanSee: req.user._id } }
  );
  res.status(200).json(x);
};
