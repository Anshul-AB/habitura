const express = require("express");
// const morgan = require('morgan');
// const helmet = require('helmet');
// const socketIo = require('socket.io'); // Ensure this line is present

const { createServer } = require("http"); // Import createServer
const { Server } = require("socket.io"); // Import Socket.IO
require("dotenv").config();
const cors = require("cors");
const path = require("path");
const passport = require("./auth-jwt/auth-jwt.js");
require("./conn/conn.js");

const authRoute = require("./routes/authRoute.js");
const habitRoute = require("./routes/habitList.js");
const taskRoute = require("./routes/task.js");
const progressRoute = require("./routes/progress.js");
const addNoteroute = require("./routes/addNote");
const updateProfileRoute = require("./routes/updateProfile.js");

const app = express();
const _dirname = path.join(path.resolve(), ".."); 
const port = process.env.PORT || 8000;

// Create an HTTP server and attach Socket.IO
const server = createServer(app);
// Dynamic CORS configuration based on the environment
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? "https://habitura.onrender.com"
      : "http://localhost:3000",
  methods: ["GET", "POST"],
  allowedHeaders: ["Authorization"],
  credentials: true,
};

const io = new Server(server, { cors: corsOptions });

// // Attach io to app (making it globally accessible)
app.set("io", io);

// Middleware to parse JSON bodies
app.use(express.json());

// Enable CORS
// Apply CORS middleware
app.use(
  cors({
    origin: "*",
  })
);

// Security Middleware
// app.use(helmet());

// Logging Middleware
// app.use(morgan('dev'));

// Passport middleware
app.use(passport.initialize());

// Routes middleware
app.use("/auth", authRoute);
app.use("/habit", habitRoute);
app.use("/task", taskRoute);
app.use("/track", progressRoute);
app.use("/myNotes", addNoteroute);
app.use("/updateUser", updateProfileRoute);

// Serve static files from the 'file-uploads' directory
app.use("/file-uploads", express.static(path.join(__dirname, "file-uploads")));

// Serve static files from the 'frontend/build' directory
app.use(express.static(path.join(_dirname, "frontend/build")));
app.get("*", (req, res) => {
  // Handle all other routes by sending the 'index.html' file
  res.sendFile(path.join(_dirname, "frontend", "build", "index.html"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

server.listen(port, () => {
  console.log("Server is Listening at port ", port);
});
