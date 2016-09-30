'use strict';


const Promise = require("bluebird");
const state = require("./stateMachine");
const messageThread = require("./messageThread");
const scriptEngine = require("./scriptEngine");

let currentState, outgoingMessage, output;

module.exports = {

  in(message) {
    return new Promise(function(resolve, reject){
      console.log("DIGEST MESSAGE", message);
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

      state.next(message);
      currentState = state.get();

      let outgoingMessages = messageThread.set(currentState, message);

      resolve(outgoingMessages);
    });
  }
}
