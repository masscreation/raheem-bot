'use strict';

const Promise = require("bluebird");
const state = require("./stateMachine");

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


  digest(currentState, message) {
    return Promise.each(scriptArray, function(script){
      if (currentState.scripts && currentState.scripts.indexOf(script.type()) !== -1){
        return script.digest(currentState, message);

      } else {
        return Promise.resolve();

      }
    });
  },

  format(currentState, message) {

    if (currentState.scripts){
      scriptArray.forEach(function(script){
        if (currentState.scripts && currentState.scripts.indexOf(script.type()) !== -1){
          let newOutgoingMessage = script.format(currentState);
          newOutgoingMessage ? output = newOutgoingMessage : output = currentState;
        }
      });
      return output;

    } else {
      return currentState;

    }
  }
}