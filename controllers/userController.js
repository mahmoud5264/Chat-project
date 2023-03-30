const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")

function isValidPassword(x) {
    if (x.length < 8) return 0;
    let s = "~`!@#$%^&*()_-+={[}]|:;<,>.?/";
    let symbol = 0;
    for (let i = 0; i < s.length; i++) {
        if (x.indexOf(s[i]) !== -1) {
            symbol = 1;
            break;
        }
    }
    if (!symbol) return 0;
    let small = 0,
        capital = 0,
        num = 0;
    for (let i = 0; i < x.length; i++) {
        let ch = x.charAt(i);
        if (ch >= "a" && ch <= "z") small = 1;
        else if (ch >= "A" && ch <= "Z") capital = 1;
        else if (ch >= "0" && ch <= "9") num = 1;
    }
    if (!small || !capital || !num) return 0;
    return 1;
}

signUp = async (req, res) => {
    const data = await User.findOne({ email: req.body.email })
    if (data) {
        return res.status(400).json("email already signed up");
    }
    let x = req.body.password;
    if (!isValidPassword(x)) {
        res
            .status(400)
            .json(
                "Password must be a minimum of 8 characters, with at least: one uppercase letter, one lowercase letter, one number and one symbol."
            );
        return;
    }
    bcrypt.hash(req.body.password, 10).then(async (hashed) => {
        let email = req.body.email;
        let user = null;
        try {
            user = await User.create({
                email,
                password: hashed,
            });
        } catch {
            return res.status(400).json("Please enter all required fields");
        }
        res.status(200).json("signup sucessfully");
    });
};

signIn = async (req, res) => {
    console.log(req.body.email);
    const usertmp = await User.findOne({ email: req.body.email })
    console.log(usertmp);
    if (!usertmp) {
        return res.status(203).json("Email is not exist");
    }
 
    bcrypt.compare(req.body.password, usertmp.password).then((same) => {
        if (!same) {
            return res.status(400).json("Password is not correct");
        }
        const token = jwt.sign({ "id": usertmp._id }, "HS256");
        res.status(200).send({ token: token });
    });
};

module.exports = { signUp , signIn } ;