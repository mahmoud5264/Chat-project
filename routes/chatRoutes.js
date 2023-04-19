const { allChats, chatMemebers, allPinnedChats , getChat , createChat , changeName} = require('../controllers/chatController');
const { isLogin } = require('../helper/login');
const upload = require("../utils/multer")

const route = require('express').Router()
route.get('/allChats', isLogin, allChats)
route.get('/members/:id', isLogin, chatMemebers)
route.get('/getChat/:id', isLogin, getChat);
route.post('/pinned', isLogin, allPinnedChats)
route.post('/create', upload.multerProfile.single('image'), isLogin, createChat)
route.post('/rename', isLogin, changeName)
module.exports = route