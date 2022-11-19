const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatList = new Schema({
    userEmail : {
        type: String,
        unique: true,
        required: true
    },
    chatList : {
        type: [Schema.Types.ObjectId],
        ref: 'Chat'
    }
})