'use strict'

const store = require('./store')
const content = require('../content');
const initialState = "STEP:1_GET_STARTED_PAYLOAD";
let currentState = initialState;

/*
 * Collection of methods related to identifying where the user 'is' in the
 * flow of conversation with the bot
 */
module.exports = {

  next() {
    console.log("NEXT")

    currentState = content[currentState].nextMessage
  },

  get(message) {
    //Check if currentState is a button, if so set currentState by user input
    //Better if stored and references like
    // TODO: Rethink naming of variables and objects in state
    if (currentState[message] && typeof currentState === 'object'){
      currentState = currentState[message];
    }
    console.log("GET", content[currentState])
    return content[currentState];
  }

};
