'use strict';

const MessageService = require('./messageService');
const MessageCourier = require('./messageCourier');
const AnalyticsApi = require('./services/analyticsAppApi');
const SeedAppService = require('./services/seedAppApi');
const async = require('async');
const Raven = require('raven');

Raven.config('https://e5eb226eff9f453cb8aaaf130bcb8a62:601a1c12a6714c86ab502f432f6002a8@sentry.io/130176', {
  captureUnhandledRejections: true
}).install();

module.exports = function(rawEvent) {

  if(rawEvent.message || rawEvent.postback) {

    let senderID = rawEvent.sender.id;

    async.waterfall([

      function getOrCreateUser(callback) {
        Raven.context(function() {
          Raven.captureBreadcrumb({
            message: 'Contacting Raheem API to get or create new user',
            category: 'API',
            data: {
              fbID: senderID,
              rawEvent: rawEvent
            }
          });
          SeedAppService.getOrCreateUser(rawEvent).then(function(){
            callback(null, rawEvent);
          });
        });
      },

      function parseMessage(messagingEvent, callback) {
        Raven.context(function() {
          Raven.captureBreadcrumb({
            message: 'Parsing incoming message',
            category: 'Message Services',
            data: {
              fbID: senderID,
              rawEvent: messagingEvent
            }
          });
          MessageService.parse(messagingEvent).then(function(parsedMessage){
            callback(null, parsedMessage);
          });
        });
      },

      function courierIn(parsedMessage, callback) {
        Raven.context(function() {
          Raven.captureBreadcrumb({
            message: 'Ingesting incoming message',
            category: 'Message Engine',
            data: {
              fbID: senderID,
              rawEvent: parsedMessage
            }
          });
          MessageCourier.in(parsedMessage, senderID).then(function(digestedMessage){
            callback(null, digestedMessage);
          });
        });
      },

      function courierOut(digestedMessage, callback) {
        Raven.context(function() {
          Raven.captureBreadcrumb({
            message: 'Formatting outgoing message',
            category: 'Message Engine',
            data: {
              fbID: senderID,
              rawEvent: digestedMessage
            }
          });
          MessageCourier.out(digestedMessage, senderID).then(function(newMessage){
            SeedAppService.logIncidentData(senderID);
            callback(null, newMessage);
          });
        });
      }],

      function(err, newMessage) {
        Raven.context(function() {
          Raven.captureBreadcrumb({
            message: 'Formatting and sending outgoing message',
            category: 'Message Services',
            data: {
              fbID: senderID,
              rawEvent: newMessage
            }
          });
          MessageService.formatAndSend(newMessage, senderID)
        });
      }
    );
  }
}
