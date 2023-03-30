const express = require("express");
const jwt = require("jsonwebtoken");
const guard = require("../helper/login")
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/signup", userController.signUp);
router.post("/signin/", userController.signIn); 
router.post('/sendrequest/:ID/', guard.isLogin, userController.sendRequest);
router.post('/cancelrequest/:ID/', guard.isLogin, userController.cancelRequest);

module.exports = router