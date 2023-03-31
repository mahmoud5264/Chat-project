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
sendRequest = async (req, res) => {
    const him = await User.findById(req.params.ID);
    const me = await User.findById(req.user._id);
    let error = "";
    if (!me || !him || String(me._id) === String(him._id))
      return res.status(400).json("Invalid user");
    if (him.blockedUsers.findIndex((e) => String(e) === String(me._id)) !== -1)
      error = "User has blocked you";
    if (
      me.recievedRequests.findIndex((e) => String(e) === String(him._id)) !== -1
    )
      error = "User has already sent connection request to you";
    if (me.sentRequests.findIndex((e) => String(e) === String(him._id)) !== -1)
      error = "Connection request is already sent";
    if (me.connections.findIndex((e) => String(e) === String(him._id)) !== -1)
      error = "User is already connected with you";
    if (error) {
      return res.status(400).json(error);
    }
    me.sentRequests.push(him._id);
    him.recievedRequests.push(me._id);
    await me.save();
    await him.save();
    res.json(me);
  };
   
  cancelRequest = async (req, res) => {
    const him = await User.findById(req.params.ID);
    const me = await User.findById(req.user._id);
    let error = "";
    if (!me || !him || String(me._id) === String(him._id))
      return res.status(400).json("Invalid user");
    if (me.sentRequests.findIndex((e) => String(e) === String(him._id)) === -1)
      error = "You have not sent connection request to cancel";
    if (error) {
      return res.status(400).json(error);
    }
    const i1 = me.sentRequests.findIndex((e) => String(e) === String(him._id));
    const i2 = him.recievedRequests.findIndex(
      (e) => String(e) === String(me._id)
    );
    me.sentRequests.splice(i1, 1);
    him.recievedRequests.splice(i2, 1);
    await me.save();
    await him.save();
    res.json(me);
  };

module.exports = { signUp , signIn, sendRequest , cancelRequest} ;