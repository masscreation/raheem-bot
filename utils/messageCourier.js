'use strict';


const Promise = require("bluebird");
const state = require("./stateMachine");
const messageThread = require("./messageThread");
const scriptEngine = require("./scriptEngine");

let scripts = [
  "varScript",
  "locationScript",
  "dateScript"
];

let scriptArray = [];


let loadScripts = function(){
  scripts.forEach(function(script){
    scriptArray.push(require(`./scripts/${script}`));
  });
}

let currentState, outgoingMessage, output;

loadScripts();

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
