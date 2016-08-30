'use strict';

const fb = require('./services/fbMessengerSendApi');
const convoEngine = require('./convoEngine');
const Message = require('../models/webhook/message');
const Postback = require('../models/webhook/postback');
const messageTemplate = require('../models/templates/message');
const buttonTemplate = require('../models/templates/button');
const genericTemplate = require('../models/templates/generic')


function createTemplate(recipientID, obj) {
  if (obj.type === "message") {
    return messageTemplate(recipientID, obj.text);
  } else if (obj.type === "button") {
    return buttonTemplate(recipientID, obj);
  } else if (obj.type === "generic") {
    console.log("GENERIC");
    console.log(genericTemplate(recipientID, obj))
    // return genericTemplate(recipientID, obj);
  }
};

module.exports = function(messagingEvent) {

    if (messagingEvent.optin) {
      console.log("receivedAuthentication");
      // receivedAuthentication(messagingEvent);

    } else if (messagingEvent.message) {

      let message = new Message(messagingEvent);
      console.log("ECHO: ", message.isValid());
      if (message.isValid()) {

        let senderID = message.senderID;
        convoEngine.send(message.userContent).then(function(outgoingObj){

          for (let i = 0, len = outgoingObj.length; i < len; i++) {
            let obj = outgoingObj[i];
            if (i > 1){
              sleep(1000).then(() => {fb.send(createTemplate(senderID, obj))});
            } else {
              fb.send(createTemplate(senderID, obj))
            }
          };


        }).catch(function(err) {
          console.log(err.message);

        });
      }

    } else if (messagingEvent.delivery) {
      console.log(" receivedDeliveryConfirmation");
      // receivedDeliveryConfirmation(messagingEvent);

    } else if (messagingEvent.postback) {

      console.log(messagingEvent.postback);

      let postback = new Postback(messagingEvent);
      let senderID = postback.senderID;

      convoEngine.send(postback.userContent).then(function(outgoingObj){

        // send user back something
        for (let i = 0, len = outgoingObj.length; i < len; i++) {
          let obj = outgoingObj[i];
          if (i > 1){
            sleep(1000).then(() => {fb.send(createTemplate(senderID, obj))});
          } else {
            fb.send(createTemplate(senderID, obj))
          }
        };

      }).catch(function(err) {
        console.log(err.message);
      });

    } else if (messagingEvent.read) {
      console.log('receivedMessageRead');

    } else {
      console.log("Webhook received unknown messagingEvent: ", messagingEvent);
    }
}

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
