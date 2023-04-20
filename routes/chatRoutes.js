const { allChats, chatMemebers, allPinnedChats,leaveGroup,pinChat ,unpinChat ,blockChat, unblockChat,getChat , createChat , changeName} = require('../controllers/chatController');
const { isLogin } = require('../helper/login');
const upload = require("../utils/multer")

const route = require('express').Router()
route.get('/allChats', isLogin, allChats)
route.get('/members/:id', isLogin, chatMemebers)
route.get('/getChat/:id', isLogin, getChat);
route.post('/pinned', isLogin, allPinnedChats)
route.post('/create', upload.multerProfile.single('image'), isLogin, createChat)
route.post('/rename', isLogin, changeName)
route.post('/leaveGroup', isLogin, leaveGroup)
route.post('/toPin', isLogin, pinChat)
route.post('/unpin', isLogin , unpinChat)
route.post('/Block' ,isLogin , blockChat)
route.post('/unBlock' , isLogin , unblockChat)

module.exports = route