'use strict'

const content = require('../content');
const convoEngine = require('./convoEngine');
const state = require('./stateMachine');

let messagesArray = [];

module.exports = {

  set(obj) {

    // if multiple messages at same time
    while (obj.waitForUser === false){
      messagesArray.push(obj);
      state.next();
      obj = state.get();
    };

    messagesArray.push(obj);
    let outgoingMessages = messagesArray;
    
    // reset
    messagesArray = [];
    return outgoingMessages;
  }

}
