const Chat = require("../models/chatModel");
const mongoose = require("mongoose");


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


exports.getChat = async (req, res) => {
  if (mongoose.Types.ObjectId.isValid(req.params.id)) {
    let chat = await Chat.findById(req.params.id)
      .populate("whoCanSend", "_id")
      .populate("users", "-password")

      .populate("latestMessage");
    if (chat) {
      if (chat.users.findIndex(e => String(e._id) === String(req.user._id)) === -1) res.status(400).json("You are not a member in this chat")
      else res.status(200).json(chat);
    } else {
      res.status(400).json("Chat not found");
    }
  } else {
    res.status(400).json("Chat not found");
  }
};

exports.createChat = async (req, res) => {
  if (!req.body.users) return res.status(400).json("Please enter users for the chat")
  if (!req.body.groupAdmins) return res.status(400).json("Please enter admins for the chat")
  let ok = req.body.users.split(',').length > 1;
  if (!ok) return res.status(400).json("Please enter users for the chat")
  let users = req.body.users.split(',');
  if (users.findIndex(e => String(e) === String(req.user._id)) === -1) return res.status(400).json("Please enter your self in chat members to create the chat")
  let chatName = req.body.chatName;
  let admins = req.body.groupAdmins.split(',');
  for (let i = 0; i < users.length; ++i) {
    if (!mongoose.Types.ObjectId.isValid(users[i])) {
      res.status(400).json("ID for some user is not valid");
      return;
    }
  }
  let check = [];
  if (!chatName && users.length === 2) {
    check = await Chat.find({ users: { $all: users }, isGroupChat: false });
  }
  if (check.length) {
    res.status(200).json(check[0]);
    return;
  }
  let image
  console.log(req.file);
  if (req.file && req.file.fieldname === "image") image = req.file.filename
  try {
    const createdChat = await Chat.create({
      chatName: chatName ? chatName : "",
      isGroupChat: chatName ? true : false,
      users: users,
      groupAdmins: admins,
      whoCanSend: users,
      Image: image,
      whoBlocked:""
    });
    const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
      "whoCanSend",
      "-password"
    );
    res.status(200).json(FullChat);
  } catch (error) {
    res.status(400).json(error.message);
  }
};


exports.changeName = async (req, res) => {
  console.log(req.user._id);
  if (mongoose.Types.ObjectId.isValid(req.body.id)) {
    let check = await Chat.findByIdAndUpdate(req.body.id, {
      chatName: req.body.name,
    });

    if (check) {
      if (!check.isGroupChat) return res.status(400).json("Can not rename private chats")
      if (check.groupAdmins.findIndex(e => String(e) === String(req.user._id))) return res.status(400).json("Only group admins can rename the group")
      else res.status(200).json("chat renamed");
      return;
    } else {
      res.status(400).json("rename failed");
    }
  } else {
    res.status(400).json("chat doesn't exist");
  }
};


exports.leaveGroup = async (req, res) => {
  let data = await Chat.findByIdAndUpdate(req.body.id, {
    $pull: { whoCanSend: req.user._id },
  });
  res.status(200).json(data);
};

exports.pinChat = async (req, res) => {
  let data = await Chat.findByIdAndUpdate(req.body.id, {
    $push: { pinnedBy: req.user._id },
  })
  res.status(200).json(data);
}

exports.unpinChat = async (req, res) => {
  let data = await Chat.findByIdAndUpdate(req.body.id, {
    $pull: { pinnedBy: req.user._id },
  })
  res.status(200).json(data);
}

exports.blockChat = async (req, res) => {
  let data = await Chat.findByIdAndUpdate(req.body.id, {

    $pull: {whoCanSend: {$exists: true}},$set: { whoBlocked:req.user._id },
  })
  //console.log(data);
  res.status(200).json(data);
}

exports.unblockChat = async (req, res) => {
  let chat = await Chat.findById(req.body.id)
  if(String(chat.whoBlocked)!=String(req.user._id))return res.status(400).json("you are not allowed to un block this");
  //console.log(chat);
  let data = await Chat.findByIdAndUpdate(req.body.id, {

    $push: { whoCanSend: chat.users },$set: { whoBlocked:"" },
  })
  res.status(200).json(data);
}

