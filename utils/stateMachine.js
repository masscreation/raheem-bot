'use strict'

const Store = require('./store');
const SeedAppService = require('./services/seedAppApi');
const content = require('../content');
const initialState = "STEP:1_GET_STARTED_PAYLOAD";
let currentState = initialState;

/*
 * Collection of methods related to identifying where the user 'is' in the
 * flow of conversation with the bot
 */

module.exports = {

  next(message) {

    if (typeof message === "string"){
      if (message.toLowerCase() === "stop" ||
          message.toLowerCase() === "exit" ||
          message.toLowerCase() === "goodbye" ||
          message.toLowerCase() === "quit"){
            currentState = "STEP:QUIT_CONVO_PRE";
      }
    }

    if (currentState === 'STEP:END_THANK_YOU'){
      SeedAppService.logIncident();
      SeedAppService.updateUser();
      Store.archiveData();
    }

    if (content[currentState]["referenceStore"]){
      message = Store.data[content[currentState]["referenceStore"]];
      console.log("message", message)
    }


    currentState = content[currentState].nextMessage
    console.log('MESSAGE', message)
    console.log('CURRENTSTATE', currentState)
    console.log("NEXT", currentState[message])

    if (typeof currentState === 'object' &&
        (currentState[message.toLowerCase()] ||
        currentState[message])){
        currentState = (Number(message) === NaN) ? currentState[message.toLowerCase()] : currentState[message];

    } else if (typeof currentState === 'object' && currentState["*"]){
      currentState = currentState["*"];

    } else if (typeof currentState === 'object' &&
               currentState[message.toLowerCase()] === undefined &&
               Number(message) === NaN){
      currentState = "STEP:UNKNOWN_INPUT";

    } else if (Store.flag){
      currentState = "STEP:UNKNOWN_INPUT";

    } else if (currentState === "STEP:LAST_STEP"){
      Store.state.forEach(function(state){
        if (content[state]["anchor"] && content[state]["anchor"] === true){
          currentState = state;
        }
      });
    }
    Store.appendState(currentState);

  },

  reRoute(message){

    if (typeof message === "string"){

      if (message === "Search Again"){
        currentState = "STEP:QUE_LOCATION_RETRY";

      } else if (message === "resume" && currentState !== "NAV_MENU"){
        let lastStateIndex = Store.state.length;
        currentState = Store.state[lastStateIndex - 2];

      } else if (message.toLowerCase() === "restart"){
        currentState = Store.resetState();

      } else if (message.toLowerCase() === "new report"){
        currentState = Store.resetState();

      }

    }

    console.log("GET STATE", currentState)
  },

  get() {
    return content[currentState];
  }

};
