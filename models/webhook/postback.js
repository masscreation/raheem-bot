'use strict'

module.exports = class Postback {

  constructor(event) {

    console.log("RECIPIENT ID:" event.recipient.id)
    console.log("SENDER ID:" event.sender.id)
    
    this.senderID = event.sender.id;
    this.recipientID = event.recipient.id;
    this.timeOfMessage = event.timestamp;

    // types of messages
    this.postback = event.postback || 0;

    // You may get a text or attachment but not both
    this.userContent = this.postback.payload
  }

}
