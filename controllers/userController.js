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

blockUser = async (req, res) => {
    const hisdata = await User.findById(req.params.ID);
    const mydata = await User.findById(req.user._id);
    let error = "";
    if (!mydata || !hisdata || String(mydata._id) === String(hisdata._id))
        return res.status(400).json("Invalid user");
    if (mydata.blockedUsers.findIndex((e) => String(e) === String(hisdata._id)) !== -1)
        error = "You have already blocked this user";
    if (error) {
        return res.status(400).json(error);
    }
    if (mydata.connections.findIndex((e) => String(e) === String(hisdata._id)) !== -1) {
        const hisindex = mydata.connections.findIndex((e) => String(e) === String(hisdata._id));
        const myindex = hisdata.connections.findIndex((e) => String(e) === String(mydata._id));
        mydata.connections.splice(hisindex, 1);
        hisdata.connections.splice(myindex, 1);
    }
    if (mydata.sentRequests.findIndex((e) => String(e) === String(hisdata._id)) !== -1) {
        const hisindex = mydata.sentRequests.findIndex((e) => String(e) === String(hisdata._id));
        const myindex = hisdata.recievedRequests.findIndex(
            (e) => String(e) === String(mydata._id)
        );
        mydata.sentRequests.splice(hisindex, 1);
        hisdata.recievedRequests.splice(myindex, 1);
    }
    if (
        mydata.recievedRequests.findIndex((e) => String(e) === String(hisdata._id)) !== -1
    ) {
        const hisindex = mydata.recievedRequests.findIndex(
            (e) => String(e) === String(hisdata._id)
        );
        const myindex = hisdata.sentRequests.findIndex((e) => String(e) === String(mydata._id));
        mydata.recievedRequests.splice(hisindex, 1);
        hisdata.sentRequests.splice(myindex, 1);
    }
    mydata.blockedUsers.push(hisdata._id);
    await mydata.save();
    await hisdata.save();
    res.json(mydata);
};
 
unblockUser = async (req, res) => {
    const hisdata = await User.findById(req.params.ID);
    const mydata = await User.findById(req.user._id);
    let error = "";
    if (!mydata || !hisdata || String(mydata._id) === String(hisdata._id))
        return res.status(400).json("Invalid user");
    if (mydata.blockedUsers.findIndex((e) => String(e) === String(hisdata._id)) === -1)
        error = "You have not already blocked this user";
    if (error) {
        return res.status(400).json(error);
    }
    const hisindex = mydata.blockedUsers.findIndex((e) => String(e) === String(hisdata._id));
    mydata.blockedUsers.splice(hisindex, 1);
    await mydata.save();
    res.json(mydata);
};

module.exports = { signUp , signIn ,blockUser ,unblockUser} ;