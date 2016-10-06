'use strict';

const Promise = require("bluebird");
const state = require("./stateMachine");
const messageThread = require("./messageThread");
const scriptEngine = require("./scriptEngine");
const Store = require("./store");

let currentState, outgoingMessage, output;

module.exports = {

  in(rawEvent) {
    return new Promise(function(resolve, reject){
      let message = rawEvent.userContent;
      //Grab state from previous turn
      state.reRoute(message)
      currentState = state.get();
        //If the currentState includes scripts, iterate through and execute them
      scriptEngine.digest(currentState, message)
      .then(function(){
        resolve(message);

      });
    });
  },

  out(message) {
    return new Promise(function(resolve, reject){
      console.log("FORMAT MESSAGE START");

      Store.saveData();

      state.next(message);
      currentState = state.get();

      let outgoingMessages = messageThread.set(currentState, message);

      resolve(outgoingMessages);
    });
  }
}
