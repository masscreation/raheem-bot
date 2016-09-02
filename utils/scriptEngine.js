'use strict';


const Promise = require("bluebird");
const state = require("./stateMachine");
const messageThread = require("./messageThread");

let scripts = [
  "varScript",
  "locationScript",
  "dbScript"
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


    digest(message) {
      return new Promise(function(resolve, reject){
        console.log("DIGEST MESSAGE START");
        //Grab state from previous turn
        currentState = state.get(message);
        //If the currentState includes scripts, iterate through and execute them
          return Promise.each(scriptArray, function(script){
            if (currentState.scripts && currentState.scripts.indexOf(script.type()) !== -1){
              return script.digest(currentState, message)

            } else {
              return Promise.resolve()

            }
          }).then(function(){
            resolve(message)
          });
    });
  },

  format(message) {
    return new Promise(function(resolve, reject){
      console.log("FORMAT MESSAGE START");

      state.next()
      currentState = state.get(message);

      if (currentState.scripts){
        scriptArray.forEach(function(script){
          if (currentState.scripts && currentState.scripts.indexOf(script.type()) !== -1){
            let newOutgoingMessage = script.format(currentState);
            newOutgoingMessage ? output = newOutgoingMessage : output = currentState
          }
        });

        let outgoingMessages = messageThread.set(output);

        resolve(outgoingMessages)
      } else {


        let outgoingMessages = messageThread.set(currentState);

        resolve(outgoingMessages)
      }
    })
  }
}
