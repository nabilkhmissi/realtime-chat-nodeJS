const mongoose = require('mongoose');

const user_schema = new mongoose.Schema({
    name: String,
    password: String,
    username: String,
    friends: [{ type: mongoose.Types.ObjectId, ref: 'User' }]
})

module.exports = mongoose.model('User', user_schema)