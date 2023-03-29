const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();


const port = process.env.BACKEND_PORT || 8000;
const hostname = process.env.BACKEND_HOSTNAME || "127.0.0.1";
app.listen(port, hostname, () => {
    console.log(`Server is running at http://${hostname}:${port}/`);
});