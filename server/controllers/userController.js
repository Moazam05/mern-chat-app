const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");

exports.getAllUsers = catchAsync(async (req, res, next) => {
  //  Find all users
  const users = await User.find({});

  // Only return the name and id of each user
  const usersList = users.map((user) => {
    return {
      username: user.username,
      userId: user._id,
    };
  });

  res.status(200).json({
    status: "success",
    results: users.length,
    data: usersList,
  });
});
