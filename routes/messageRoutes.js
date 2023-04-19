const { sendMessage, editMessage } = require('../controllers/messageContoller');
const upload = require("../utils/multer");
const { isLogin } = require('../helper/login');

const route = require('express').Router()

route.post('/send', isLogin,upload.multerAll.single("file"),sendMessage)
route.post('/edit',isLogin,editMessage)

module.exports = route