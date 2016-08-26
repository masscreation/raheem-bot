'use strict';

const fb = require('./services/fbMessengerSendApi');
const Message = require('../models/message.js');
const Postback = require('../models/postback.js');

module.exports = {

  in(messagingEvent){
    if (messagingEvent.optin) {
      console.log("receivedAuthentication");
      // receivedAuthentication(messagingEvent);

    } else if (messagingEvent.message) {
      console.log(messagingEvent.message);
      let message = new Message(messagingEvent);
      convoEngine.send(message.senderID, message.userContent) if message.isValid();

    } else if (messagingEvent.delivery) {
      console.log(" receivedDeliveryConfirmation");
      // receivedDeliveryConfirmation(messagingEvent);

    } else if (messagingEvent.postback) {
      console.log(messagingEvent.postback);
      let postback = new Postback(messagingEvent);
      convoEngine.send(postback.senderID, postback.userContent)

    } else if (messagingEvent.read) {
      console.log('receivedMessageRead');

    } else {
      console.log("Webhook received unknown messagingEvent: ", messagingEvent);
    }
  }

  out(recipientID, content){
    if (content.type === "message"){
      fb.send(messageOut(recipientID, content));

    } elseIf (content.type === "button"){
      fb.send(postbackOut(recipientID, content));

    }
  }
}
