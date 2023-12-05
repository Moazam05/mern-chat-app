// 3rd party imports
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      minlength: 3,
      required: [true, "Please tell us your User Name!"],
    },
    password: {
      type: String,
      minlength: 8,
      required: [true, "Please provide a password"],
      // select: false,
    },
  },
  {
    timestamps: true,
  }
);

// Password Hashing
userSchema.pre("save", async function (next) {
  // Only hash the password if it is new or has been modified
  if (!this.isModified("password")) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// instance method
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = new mongoose.model("User", userSchema);
module.exports = User;
