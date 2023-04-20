const express = require("express");
const app = express();
const port = 8000;
const cors = require("cors")
const hostname = "127.0.0.1";
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const dotenv = require("dotenv");
const mongoose = require("mongoose")
dotenv.config();

mongoose.connect("mongodb://0.0.0.0:27017/ChatApplication", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use(cors());

app.use("/auth", userRoutes)
app.use("/chat", chatRoutes)
app.use("/message", messageRoutes)

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});