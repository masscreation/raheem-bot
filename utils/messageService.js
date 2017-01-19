'use strict';

const fbService = require('./services/fbMessengerSendApi');

const Message = require('../models/webhook/message');
const Postback = require('../models/webhook/postback');
const Attachment = require('../models/webhook/attachment');

const messageTemplate = require('../models/templates/message');
const buttonTemplate = require('../models/templates/button');
const genericTemplate = require('../models/templates/generic');
const quickReplyTemplate = require('../models/templates/quickReply');

module.exports = {

  parse(messagingEvent) {
    return new Promise(function(resolve, reject) {

      if (messagingEvent.optin) {
        console.log("Received Authentication");
        reject(new Error);

      } else if (messagingEvent.message) {
        console.log("Received Message");
        let message = new Message(messagingEvent);
        message.isValid() ? resolve(message) : reject(new Error);

      } else if (messagingEvent.delivery) {
        console.log("Received Delivery Confirmation");
        reject(new Error);

      } else if (messagingEvent.postback) {
        console.log("Received Postback");
        resolve(new Postback(messagingEvent));

      } else if (messagingEvent.read) {
        console.log('Received Message Read');
        reject(new Error);

      } else {
        console.log("Webhook received unknown messagingEvent: ", messagingEvent);
        reject(new Error);

      }
    })
  },

  formatAndSend(outgoingObj, senderID) {
    for (let i = 0, len = outgoingObj.length; i < len; i++) {
      let obj = outgoingObj[i];
      if (i > 0){
        sleep(1000).then(function() {
          fbService.send(createTemplate(senderID, obj));
        });
      } else {
        fbService.send(createTemplate(senderID, obj));
      }
    }
  }
}

function createTemplate(recipientID, obj) {
  //figure out what type of message the obj will be and return the formatted result
  if (obj.type === "message") {
    console.log("FORMATTING MESSAGE");
    return messageTemplate(recipientID, obj.text);
  } else if (obj.type === "button") {
    console.log("FORMATTING BUTTON");
    return buttonTemplate(recipientID, obj);
  } else if (obj.type === "generic") {
    console.log("FORMATTING GENERIC");
    return genericTemplate(recipientID, obj)
  } else if (obj.type === "quickReply") {
    console.log("FORMATTING QUICKREPLY")
    return quickReplyTemplate(recipientID, obj)
  }
};

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
