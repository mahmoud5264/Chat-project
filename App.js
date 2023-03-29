const express = require("express");
const app = express();
const port = 8000;
const hostname = "127.0.0.1";
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const chatRoutes = require("./routes/chatRoutes");
const areaRoutes = require("./routes/CountriesRoutes");
const LanguagesRoutes = require("./routes/LanguagesRoutes");
const projectRoutes = require("./routes/projectRoutes");
const teamRoutes = require("./routes/teamRoutes");
const fileRoutes = require("./routes/fileRoutes");
const taskClassRoutes = require("./routes/taskClassRoutes");

const passport = require("passport");
const dotenv = require("dotenv");
dotenv.config();
app.use(express.json());
app.use(cors());
const session = require("express-session");
const mongoose = require("mongoose");

mongoose.connect("mongodb://0.0.0.0:27017/GP", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});