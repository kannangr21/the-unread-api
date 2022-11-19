const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const unreadMsgSchema = new Schema({
    toKey : {
        type: String,
        unique: true,
        required: true
    },
    messages : [
        {
            messageContent : String,  
            messageTime : String,
            messageDate: String
                
        }
    ]
});

const unreadMessages = mongoose.model('unread', unreadMsgSchema);
module.exports = unreadMessages;