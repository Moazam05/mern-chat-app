const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Please provide a sender"],
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Please provide a recipient"],
  },
  text: {
    type: String,
    required: [true, "Please provide a text message"],
  },
});

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
