const express = require("express");
const authController = require("../controllers/authController");
const messageController = require("../controllers/messageController");

const router = express.Router();

router.use(authController.protect);

router.get("/:userId", messageController.getMessages);

module.exports = router;
