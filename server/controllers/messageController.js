const catchAsync = require("../utils/catchAsync");
const Message = require("../models/messageModel");

exports.getMessages = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const { _id: currentUserId } = req.user;
  //   await Message.deleteMany({});
  const messages = await Message.find({
    $or: [
      { sender: currentUserId, recipient: userId },
      { sender: userId, recipient: currentUserId },
    ],
  }).sort({ createdAt: -1 });

  res.status(200).json({
    status: "success",
    results: messages.length,
    messages,
  });
});
