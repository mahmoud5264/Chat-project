const { allChats, chatMemebers, allPinnedChats} = require('../controllers/chatController');
const { isLogin } = require('../helper/login');
const upload = require("../utils/multer")

const route = require('express').Router()
route.get('/allChats', isLogin, allChats)
route.get('/members/:id', isLogin, chatMemebers)
route.post('/pinned', isLogin, allPinnedChats)
module.exports = route