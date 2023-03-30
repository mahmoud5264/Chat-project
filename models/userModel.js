const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png'
    },
    connections: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
    ],
    sentRequests: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
    ],
    recievedRequests: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
    ],
    blockedUsers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
    ],
})


module.exports = mongoose.model('user', userSchema)