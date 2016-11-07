'use strict';

const MessageService = require('./messageService');
const MessageCourier = require('./messageCourier');
const AnalyticsApi = require('./services/analyticsAppApi');
const SeedAppService = require('./services/seedAppApi');

const async = require('async');

module.exports = function(rawEvent) {

  if(rawEvent.message || rawEvent.postback) {

    let senderID = rawEvent.sender.id;

    async.waterfall([

      function getOrCreateUser(callback) {
        SeedAppService.getOrCreateUser(rawEvent).then(function(){
          callback(null, rawEvent);
        });
      },

      function parseMessage(messagingEvent, callback) {
        MessageService.parse(messagingEvent).then(function(parsedMessage){
          callback(null, parsedMessage);
        });
      },

      function courierIn(parsedMessage, callback) {
        MessageCourier.in(parsedMessage, senderID).then(function(digestedMessage){
          callback(null, digestedMessage);
        });
      },

      function courierOut(digestedMessage, callback) {
        MessageCourier.out(digestedMessage, senderID).then(function(newMessage){
          SeedAppService.logIncidentData(senderID);
          callback(null, newMessage);
        });
      }],

      function(err, newMessage) {
        MessageService.formatAndSend(newMessage, senderID)
      }
    );
  }
}
