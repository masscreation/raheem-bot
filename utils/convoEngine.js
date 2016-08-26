'use strict'

const content = require('../content');
const stateMachine = require('./stateMachine');
const store = require('./store')

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

  send(recipientID, message) {
    console.log("message received that could be sent back: ", message);
    stateMachine.nextState();
    router.out(recipientID, message);
  }

};
