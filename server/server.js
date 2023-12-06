const mongoose = require("mongoose");
require("dotenv").config();
const ws = require("ws");
const { parse } = require("cookie");
// Custom Imports
const app = require("./app");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);

  process.exit(1);
});

const dbURI = process.env.DATABASE;

mongoose.connect(dbURI);

const db = mongoose.connection;

db.on("error", (error) => {
  console.error("Connection error:", error);
});

db.once("open", () => {
  console.log(`Connected to MongoDB`.cyan.underline.bold);
  console.log("Environment:", `${process.env.NODE_ENV}`.yellow);
});

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`Server in running on port ${port}`);
});

// WEB SOCKET
const wss = new ws.WebSocketServer({ server });

const userConnections = [];

function broadcastOnlineUsers() {
  const onlineUsers = userConnections.map(({ userId, username }) => ({
    userId,
    username,
  }));
  const message = JSON.stringify({ type: "onlineUsers", onlineUsers });

  // Broadcast the list of online users to all connected clients
  wss.clients.forEach((client) => {
    if (client.readyState === ws.OPEN) {
      client.send(message);
    }
  });
}

wss.on("connection", (connection, req) => {
  let userId; // Declare userId outside of the if block

  // Parse the 'user' cookie from the request headers
  const cookies = parse(req.headers.cookie || "");
  const userCookie = cookies["user"];

  if (userCookie) {
    const userObject = JSON.parse(decodeURIComponent(userCookie));
    // Access the user ID and username from the userObject
    const userId = userObject?.data?.user?._id;
    const username = userObject?.data?.user?.username;
    // Attach the WebSocket connection to the user ID
    userConnections.push({ userId, username });

    // Broadcast the updated list of online users to all clients
    broadcastOnlineUsers();

    console.log("User connected:", userId, username);
  }

  connection.on("close", () => {
    // Remove the user from the userConnections array on disconnect
    const disconnectedUserIndex = userConnections.findIndex(
      (user) => user.userId === userId
    );

    if (disconnectedUserIndex !== -1) {
      userConnections.splice(disconnectedUserIndex, 1);

      // Broadcast the updated list of online users to all clients
      broadcastOnlineUsers();
    }

    console.log("User disconnected:", userId);
  });
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);

  server.close(() => {
    process.exit(1);
  });
});
