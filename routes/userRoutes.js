const express = require("express");
const jwt = require("jsonwebtoken");
const guard = require("../helper/login")
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/signup", userController.signUp);
router.post("/signin/", userController.signIn);
router.post('/blockuser/:ID/', guard.isLogin, userController.blockUser)
router.post('/unblockuser/:ID/', guard.isLogin, userController.unblockUser)

router.post('/acceptrequest/:ID/', guard.isLogin, userController.acceptRequest)
router.post('/rejectrequest/:ID/', guard.isLogin, userController.rejectRequest)
router.post('/removeconnection/:ID/', guard.isLogin, userController.removeConnection)

module.exports = router