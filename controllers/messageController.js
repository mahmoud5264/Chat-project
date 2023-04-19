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
