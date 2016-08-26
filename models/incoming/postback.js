'use strict'

module.exports = class Postback {

  constructor(event) {
    this.senderID = event.sender.id;
    this.recipientID = event.recipient.id;
    this.timeOfMessage = event.timestamp;

    // types of messages
    this.postback = event.postback || 0;

    // message meta data
    this.isEcho = this.message.is_echo || 0;
    this.messageId = this.message.mid || 0;
    this.appId = this.message.app_id || 0;
    this.metadata = this.message.metadata || {};

    // You may get a text or attachment but not both
    this.userContent = this.postback
  }

}
