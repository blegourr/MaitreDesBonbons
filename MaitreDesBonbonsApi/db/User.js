const mongoose = require("mongoose");

const user = mongoose.Schema({
    userId: { 'type': String },
    name: { 'type': String },
    avatar: { 'type': String },
})

module.exports = mongoose.model('User', user);