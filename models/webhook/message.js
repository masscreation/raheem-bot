'use strict'

module.exports = class Message {

  constructor(event) {
    
    this.senderID = event.sender.id;
    this.recipientID = event.recipient.id;
    this.timeOfMessage = event.timestamp;

    // types of messages
    this.message = event.message || false;
    this.quickReply = event.message.quick_reply || false;
    this.attachment = event.message.attachments || false;

    // message meta data
    this.isEcho = this.message.is_echo || false;;
    this.messageId = this.message.mid || false;;
    this.appId = this.message.app_id || false;;
    this.metadata = this.message.metadata || {};

    // You may get a text or attachment but not both
    if (this.attachment){
      this.users[fbID]Content = this.attachment;
    } else if (this.quickReply){
      this.users[fbID]Content = this.quickReply.payload;
    } else {
      this.users[fbID]Content = this.message.text;
    }
  }

  isValid(){
    return !this.isEcho && this.users[fbID]Content;
  }
}
