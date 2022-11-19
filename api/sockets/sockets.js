const express = require('express');
const router = express.Router();
const WebSocket = require('ws');
const wss = new WebSocket.Server({port: 8000});
var clientDetails = new Map();
// var tempMessages = new Map();
const unreadMessages = require('../../models/UnreadMessage');

wss.on('connection', async (ws, req) => {
    var fromKey = req.headers['from-key'];
    var toKey = req.headers['to-key'];

    clientDetails.set(fromKey, ws); // Maps Socket to Client ID

    const newUnreads = await unreadMessages.findOne({toKey: fromKey}); // Checks if there are unread message

    if(newUnreads){
        var retMsg = [];
        newUnreads.messages.forEach(element => {
            retMsg.push({"messageContent":element["messageContent"],"messageType":"receiver","messageTime":element["messageTime"],"messageDate":element["messageDate"]});
        });
        newUnreads.remove();
        ws.send(JSON.stringify(retMsg)); // Sends the unread messages to the client
    }

    
    
    ws.on('message', async (message) => {
        var receiver = clientDetails.get(toKey);
        var sender = clientDetails.get(fromKey);
        var messagesReceived = JSON.parse(message);
        var messageContent = messagesReceived[0];
        var messageTime = messagesReceived[1];
        var messageDate = messagesReceived[2];
        
        if(receiver != undefined){ // If Client connected
            receiver.send(JSON.stringify({"messageContent":messageContent,"messageType":"receiver","messageTime":messageTime, "messageDate": messageDate}));
            sender.send(JSON.stringify({"messageContent":messageContent,"messageType":"sender","messageTime":messageTime, "messageDate": messageDate}));
        }
        else{ // Store in db
            const unReadMsg = await unreadMessages.findOne({toKey: toKey});
            if(unReadMsg != undefined){
                unReadMsg.messages.push({"messageContent":messageContent, "messageTime": messageTime, "messageDate": messageDate});
                await unReadMsg.save()
                .then((result) => console.log("Message Saved"))
                .catch((err) => {
                    console.log(err);
                });
            } else {
                const newUnreadMsg = new unreadMessages({
                    toKey : toKey,
                    messages : [
                        {
                            messageContent: messageContent,
                            messageTime: messageTime,
                            messageDate: messageDate
                        }
                    ]
                }
                );
                await newUnreadMsg.save()
                .then((result) => console.log("Message Saved"))
                .catch((err) => {
                    console.log(err);});
            }
            
            // Using Temperory in memory map
            // try{
            // tempMessages.set(toKey, [...tempMessages.get(toKey), {"messageContent":messageContent, "messageTime": messageTime, "messageDate": messageDate}]);}
            // catch{
            //     tempMessages.set(toKey, []);
            //     tempMessages.set(toKey, [...tempMessages.get(toKey),{"messageContent":messageContent, "messageTime": messageTime, "messageDate": messageDate}]);
            // }
            // console.log(tempMessages);

            sender.send(JSON.stringify({"messageContent":messageContent,"messageType":"sender","messageTime":messageTime, "messageDate": messageDate}));
        }
    });
    ws.on('close', () => {
        clientDetails.delete(fromKey);
    });
});

router.use(express.json());
router.use(express.urlencoded({extended: true}));

module.exports = router;