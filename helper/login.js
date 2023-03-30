const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

exports.isLogin = async (req, res, next) => {
    const h = req.headers['authorization']
    if (h == null) {
        res.status(401)
        return res.send("not authorized")
    }
    const token = h.split(' ')[1]
    if (token == null) {
        res.status(401)
        return res.send("not authorized")
    }
    try {
        const user = jwt.verify(token, 'HS256');
        console.log(user); // If there is no error, the token is valid
        const me = await User.findById(user.id)
        req.user = me
        next()
    } catch (err) {
        console.error(err); // If there is an error, the token is not valid
        return res.send("Invalid token")
    }
}