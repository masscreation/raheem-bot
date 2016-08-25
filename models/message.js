'use strict'

const convoEngine = require('../utils/convoEngine');

/*
 * Collection of methods that receive messages to user via fb
 * messenger send api
 */
module.exports = class Message {

  constructor(event) {
    this.senderID = event.sender.id;
    this.recipientID = event.recipient.id;
    this.timeOfMessage = event.timestamp;

    // types of messages
    this.message = event.message || 0;
    this.postback = event.postback || 0;

    // message meta data
    this.isEcho = this.message.is_echo || 0;
    this.messageId = this.message.mid || 0;
    this.appId = this.message.app_id || 0;
    this.metadata = this.message.metadata || {};

    // You may get a text or attachment but not both
    this.messageContent =
      this.message.text ||
      this.postback ||
      0
  }

  received() {

    if (this.isEcho) {

      // Just logging message echoes to console
      console.log("Received echo for message %s and app %d with metadata %s",
      this.messageId, this.appId, this.metadata);
      return;

    } else if (this.messageContent) {
      console.log("received message: ", this.messageContent);

      // send message content to convo engine
      convoEngine.send(this.senderID, this.messageContent);

    } else {
      console.log("Somethinf fucked up getting the message");
    }

  }

}
