'use strict';

const Promise = require("bluebird");
const state = require("./stateMachine");
const messageThread = require("./messageThread");
const scriptEngine = require("./scriptEngine");
const Store = require("./store");

let currentState, outgoingMessage, output;

module.exports = {

  in(rawEvent, fbID) {
    return new Promise(function(resolve, reject){
      let message = rawEvent.userContent;
      //Grab state from previous turn
      state.reRoute(message, fbID)
      currentState = state.get(fbID);
        //If the currentState includes scripts, iterate through and execute them
      scriptEngine.digest(currentState, message, fbID)
      .then(function(){
        resolve(message);

      });
    });
  },

  out(message, fbID) {
    return new Promise(function(resolve, reject){
      console.log("FORMAT MESSAGE START");

      currentState = state.get(fbID);

      if (currentState['loop'] && currentState["breakKey"] !== message) {
        reject();
      }

      Store.saveData(fbID);

      state.next(message, fbID);
      currentState = state.get(fbID);

      let outgoingMessages = messageThread.set(currentState, message, fbID);

      resolve(outgoingMessages);
    });
  }
}
