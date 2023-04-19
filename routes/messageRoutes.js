const { allMessages,deleteChatMessages } = require('../controllers/messageContoller');
const upload = require("../utils/multer");
const { isLogin } = require('../helper/login');

const route = require('express').Router()

route.get('/:chatId', isLogin , allMessages);
route.post('/deleteChat', isLogin, deleteChatMessages)

module.exports = route
