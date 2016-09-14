'use strict'

module.exports = class Message {

  constructor(event) {

    console.log("RECIPIENT ID:", event.recipient.id)
    console.log("SENDER ID:", event.sender.id)

    this.senderID = event.sender.id;
    this.recipientID = event.recipient.id;
    this.timeOfMessage = event.timestamp;

    // types of messages
    this.message = event.message || false;
    this.message.quick_reply = event.message.quick_reply || false;
    this.message.attachment = event.message.attachments || false

    // message meta data
    this.isEcho = this.message.is_echo || false;
    this.messageId = this.message.mid || false;
    this.appId = this.message.app_id || false;
    this.metadata = this.message.metadata || {};

    // You may get a text or attachment but not both
    if (this.message.attachment){
      this.userContent = this.message.attachment;
    } else if (this.message.quickReply){
      this.userContent = this.message.quickReply;
    } else {
      this.userContent = this.message.text
    }
  }

  isValid(){
    return !this.isEcho && this.userContent;
  }
}