const mongoose = require('mongoose');

const room_schema = new mongoose.Schema({
    users: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    messages: [{ type: mongoose.Types.ObjectId, ref: 'Message' }]
})

module.exports = mongoose.model('Room', room_schema)