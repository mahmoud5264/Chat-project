
const { sendMessage, editMessage,allMessages,deleteChatMessages } = require('../controllers/messageController');
const upload = require("../utils/multer");
const { isLogin } = require('../helper/login');
const route = require('express').Router()


route.get('/:chatId', isLogin , allMessages);
route.post('/deleteChat', isLogin, deleteChatMessages)
route.post('/send', isLogin,upload.multerAll.single("file"),sendMessage)
route.post('/edit',isLogin,editMessage)

module.exports = route

