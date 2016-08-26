'use strict'

/*
 * Collection of methods related to identifying where the user 'is' in the
 * flow of conversation with the bot
 */
module.exports = {

  nextState() {
    currentState = content[currentState].nextMessage;
    console.log("currentState: ", currentState);
  }

};
