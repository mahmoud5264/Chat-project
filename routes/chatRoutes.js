const { allChats, chatMemebers, allPinnedChats,leaveGroup,pinChat ,unpinChat ,blockChat, unblockChat} = require('../controllers/chatController');
const { isLogin } = require('../helper/login');
const upload = require("../utils/multer")

const route = require('express').Router()
route.get('/allChats', isLogin, allChats)
route.get('/members/:id', isLogin, chatMemebers)
route.post('/pinned', isLogin, allPinnedChats)
route.post('/leaveGroup', isLogin, leaveGroup)
route.post('/toPin', isLogin, pinChat)
route.post('/unpin', isLogin , unpinChat)
route.post('/Block' ,isLogin , blockChat)
route.post('/unBlock' , isLogin , unblockChat)
module.exports = route