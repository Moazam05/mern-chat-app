const express = require("express");
const morgan = require("morgan");
const colors = require("colors");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
// Custom Imports
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const userRouter = require("./routes/userRoutes");
const messageRouter = require("./routes/messageRoutes");

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

const app = express();
app.use(cookieParser());
app.use(cors(corsOptions));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json({ limit: "10kb" }));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.get("/", (req, res) => {
  res.send("Chat App API is running...");
});

// ROUTES
app.use("/api/v1/users", userRouter);
app.use("/api/v1/messages", messageRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
