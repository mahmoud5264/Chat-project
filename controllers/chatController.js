const Chat = require("../models/chatModel");
const mongoose = require("mongoose");

// Mahmoud
exports.chatMemebers = async (req, res) => {
  const chatId = req.params.id;
  const members = await Chat.find(
    { _id: chatId },
    { users: true }
  ).populate("users", "-password");
  if (members[0].users.findIndex(e => String(e._id) === String(req.user._id)) === -1) res.status(400).json("You are not a member in this chat")
  else res.status(200).json(members);
};


exports.allChats = async (req, res) => {
  const chat = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } }, pinnedBy: { $not: { $elemMatch: { $eq: req.user._id } } } })
    .populate("whoCanSend", "-password")
    .populate("users", "-password")
    .populate("latestMessage");
  chat.sort(function (a, b) {
    if (!a.latestMessage) return 1
    if (!b.latestMessage) return -1
    var x = a.latestMessage.updatedAt > b.latestMessage.updatedAt ? -1 : 1;
    return x;
  })
  res.status(200).json(chat);
};


exports.allPinnedChats = async (req, res) => {
  const id = req.body.id;
  const chat = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } },pinnedBy: { $elemMatch: { $eq: req.user._id } } })
    .populate("whoCanSend", "-password")
    .populate("users", "-password")
    .populate("latestMessage");
  chat.sort(function (a, b) {
    if (!a.latestMessage) return 1
    if (!b.latestMessage) return -1
    var x = a.latestMessage.updatedAt > b.latestMessage.updatedAt ? -1 : 1;
    return x;
  })
  res.status(200).json(chat);
};

