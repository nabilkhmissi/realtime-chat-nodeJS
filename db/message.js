const mongoose = require('mongoose');

const message_schema = new mongoose.Schema({
    content: String,
    creationDate: String,
    sender: { type: mongoose.Types.ObjectId, ref: 'User' }
})

module.exports = mongoose.model('Message', message_schema)