'use strict'

const content = require('../content');
const convoEngine = require('./convoEngine');
const state = require('./stateMachine');
const scriptEngine = require("./scriptEngine");


let messagesArray = [];

module.exports = {

  set(obj, message) {

    // if multiple messages at same time
    while (obj.waitForUser === false){
      obj = scriptEngine.format(obj);
      messagesArray.push(obj);
      state.next();
      obj = state.get();
    };

    obj = scriptEngine.format(obj);
    messagesArray.push(obj);
    let outgoingMessages = messagesArray;

    // reset
    messagesArray = [];
    return outgoingMessages;
  }

}
