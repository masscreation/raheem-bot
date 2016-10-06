// // 'use strict';
// //
// // const fb = require('./services/fbMessengerSendApi');
// // const messageCourier = require('./messageCourier');
// //
// // const Store = require('./store');
// // const Message = require('../models/webhook/message');
// // const Postback = require('../models/webhook/postback');
// // const Attachment = require('../models/webhook/attachment');
// //
// // const messageTemplate = require('../models/templates/message');
// // const buttonTemplate = require('../models/templates/button');
// // const genericTemplate = require('../models/templates/generic');
// // const quickReplyTemplate = require('../models/templates/quickReply');
// //
// // module.exports = function(messagingEvent) {
// //
// //   async.waterfall([
// //     function(callback) {
// //       Store.getOrCreateUser(messagingEvent.sender.id); }
// //     function(callback) {
// //       MessageService.parse(messagingEvent); }
// //     function(formattedMessage, callback) {
// //       MessageCourier.in(formattedMessage); }
// //     function(digestedMessage, callback) {
// //       MessageCourier.out(digestedMessage); }
// //     function(newMessage, callback) {
// //       MessageService.format(newMessage); }
// //   ], done);
// //
// //
// //
// //
// //
// //   Store.getOrCreateUser(messagingEvent.sender.id);
// //
//   if (messagingEvent.optin) {
//     console.log("Received Authentication");
//
//   } else if (messagingEvent.message) {
//
//     let message = new Message(messagingEvent);
//
//
//     if (message.isValid()) {
//       // If message is not an echo and has a payload, send it to the format/send process.
//
//       let senderID = message.senderID;
//       formatAndSend(message.userContent, senderID);
//
//     }
//
//   } else if (messagingEvent.delivery) {
//     console.log("Received Delivery Confirmation");
//     // receivedDeliveryConfirmation(messagingEvent);
//
//   } else if (messagingEvent.postback) {
//     console.log("Recieved Postback")
//     console.log("Timestamp:", messagingEvent.timestamp)
//
//     let postback = new Postback(messagingEvent);
//     let senderID = postback.senderID;
//     // Send payload to the format/send process
//
//     formatAndSend(postback.userContent, senderID);
//
//   } else if (messagingEvent.read) {
//     console.log('Received Message Read');
//
//   } else {
//     console.log("Webhook received unknown messagingEvent: ", messagingEvent);
//   }
// }
// //
// // function formatAndSend(message, senderID){
// //   //Digest incoming message (ex: save variables, call script specific api's)
// //   //Format outgoing message (ex: insert variables where needed, format locations from api call)
// //   //Iterate through resulting output and send as messages after a short delay
// //   //to ensure they arrive to user in the correct order
// //
// //   messageCourier.in(message)
// //   .then(messageCourier.out)
// //   .then(function(outgoingObj){
// //     for (let i = 0, len = outgoingObj.length; i < len; i++) {
// //       let obj = outgoingObj[i];
// //       if (i > 0){
// //         sleep(1000).then(function(){
// //           fb.send(createTemplate(senderID, obj))
// //         });
// //       } else {
// //         fb.send(createTemplate(senderID, obj))
// //       }
// //     }
// //   });
// // }
// //
// // function createTemplate(recipientID, obj) {
// //   //figure out what type of message the obj will be and return the formatted result
// //   if (obj.type === "message") {
// //     console.log("FORMATTING MESSAGE");
// //     return messageTemplate(recipientID, obj.text);
// //   } else if (obj.type === "button") {
// //     console.log("FORMATTING BUTTON");
// //     return buttonTemplate(recipientID, obj);
// //   } else if (obj.type === "generic") {
// //     console.log("FORMATTING GENERIC");
// //     return genericTemplate(recipientID, obj)
// //   } else if (obj.type === "quickReply") {
// //     console.log("FORMATTING QUICKREPLY")
// //     return quickReplyTemplate(recipientID, obj)
// //   }
// // };
// //
// // function sleep (time) {
// //   return new Promise((resolve) => setTimeout(resolve, time));
// // }
