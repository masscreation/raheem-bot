'use strict'

const content = require('../content');
const initialState = "STEP:1_GET_STARTED_PAYLOAD";
let currentState = initialState;

/*
 * Collection of methods related to identifying where the user 'is' in the
 * flow of conversation with the bot
 */
module.exports = {

  next() {
    currentState = content[currentState].nextMessage;
    console.log("currentState: ", currentState);
  },

  get() {
    return currentState;
  }

};
