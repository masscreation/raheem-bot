'use strict'

const content = require('../content');
const fb = require('./services/fbMessengerSendApi');

const initialState = "STEP:1_GET_STARTED_PAYLOAD";
let currentState = initialState;

/*
 * Collection of methods to managing the convo
 *
 */
module.exports = {

  // 1. Consult the conversation state
  // 2. Check if the user message is valid for this state
  // 3. Get the next piece of content
  // 4. Send out next piece of content

  nextState() {
    currentState = content[currentState].nextMessage;
    console.log("currentState: ", currentState);
  },

  send(recipientID, message) {
    console.log("message received that could be sent back: ", message);
    this.nextState();
    fb.sendTextMessage(recipientID, content[currentState].text || null);
  }

};
