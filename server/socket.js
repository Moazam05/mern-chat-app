const ws = require("ws");
const { parse } = require("cookie");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const AppError = require("./utils/appError");
const Message = require("./models/messageModel");

function setupWebSocketServer(server) {
  const wss = new ws.Server({ server });
  // 1) Connection Established
  wss.on("connection", async (connection, req) => {
    // Notify every one about the online people
    function notifyAboutOnlineUsers() {
      [...wss.clients].forEach((client) => {
        client.send(
          JSON.stringify({
            online: [...wss.clients].map((c) => ({
              userId: c.userId,
              username: c.username,
            })),
          })
        );
      });
    }

    // Check if the connection is alive
    connection.isAlive = true;

    connection.timer = setInterval(() => {
      connection.ping();
      connection.deathTimer = setTimeout(() => {
        connection.isAlive = false;
        connection.terminate();
        notifyAboutOnlineUsers();
      }, 1000);
    }, 5000);

    connection.on("pong", () => {
      clearTimeout(connection.deathTimer);
    });

    // Get the token, user ID and username from the cookie
    const cookies = parse(req.headers.cookie);
    const userData = JSON.parse(cookies.user);
    const { _id: userId, username } = userData.data.user;

    const { token } = userData;
    // Verify the token
    const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    if (!decode) {
      return next(
        new AppError("You are not logged in! Please log in to get access.", 401)
      );
    }

    connection.userId = userId;
    connection.username = username;

    // 3) Message Received
    connection.on("message", async (message) => {
      const messageData = JSON.parse(message.toString());
      const { recipient, text } = messageData;
      if (recipient && text) {
        // Save the message in the database
        const messageDoc = await Message.create({
          sender: connection.userId,
          recipient,
          text,
        });
        [...wss.clients]
          .filter((c) => c.userId === recipient)
          .forEach((c) => {
            c.send(
              JSON.stringify({
                text,
                sender: connection.userId,
                recipient,
                _id: messageDoc._id,
              })
            );
          });
      }
    });

    // 2) Notify every one about the online people (when someone connects)
    notifyAboutOnlineUsers();
  });

  return wss;
}

module.exports = { setupWebSocketServer };
