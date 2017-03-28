'use strict';

const Promise = require("bluebird");
const state = require("./stateMachine");
const messageThread = require("./messageThread");
const scriptEngine = require("./scriptEngine");
const Store = require("./store");
const RedisService = require("./services/redis");
const SeedAppService = require("./services/seedAppApi");

let currentState, outgoingMessage, output;

module.exports = {

  in(rawEvent, fbID) {
    return new Promise(function(resolve, reject) {
      let message = rawEvent.userContent;
      console.log("INCOMING MESSAGE: ", message);
      //Grab state from previous turn
      state.reRoute(message, fbID).then(function() {
        currentState = state.get(fbID);
        //If the currentState includes scripts, iterate through and execute them
        scriptEngine.digest(currentState, message, fbID)
        .then(function() {
          resolve(message);

        });
      });
    });
  },

  out(message, fbID) {
    return new Promise(function(resolve, reject) {
      console.log("FORMAT MESSAGE START");

      currentState = state.get(fbID);

      if (currentState['loop'] &&
          !message.url &&
          currentState["breakKey"] !== message.toLowerCase()) {
        reject();

      } else {
        Store.saveData(fbID);

        state.next(message, fbID);
        currentState = state.get(fbID);

        let outgoingMessages = messageThread.set(currentState, message, fbID);

        if (Store.isNotTest(fbID)) {
          SeedAppService.logIncidentData(fbID)
        } else {
          console.log("SKIPPING, TEST")
        }
        RedisService.saveUserBlob(fbID, Store.getUser(fbID))
        .then(function() {
          resolve(outgoingMessages);
        });
      }
    });
  }
}
