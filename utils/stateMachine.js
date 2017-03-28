'use strict'

const Store = require('./store');
const SeedAppService = require('./services/seedAppApi');
const content = require('../content');
const initialState = "STEP:1_GET_STARTED_PAYLOAD";
const greetingVar = "Raheem is a Facebook Messenger chatbot that captures your interactions with police to build a national database of police performance open to the public."
let currentState = initialState;

/*
 * Collection of methods related to identifying where the user 'is' in the
 * flow of conversation with the bot
 */

module.exports = {

  next(message, fbID) {
    currentState = Store.getState(fbID);

    if (currentState === 'STEP:FINAL_INFO'){
      SeedAppService.logIncidentData(fbID);
      SeedAppService.updateUser(fbID);
      SeedAppService.closeIncident(fbID);
    }

    if (currentState === "STEP:FURTHER_ENCOUNTER_DETAILS") {
      SeedAppService.createOfficer(fbID);
    }

    if (typeof message === "string"){
      if (message.toLowerCase() === "stop" ||
          message.toLowerCase() === "exit" ||
          message.toLowerCase() === "goodbye" ||
          message.toLowerCase() === "quit"){
            currentState = "STEP:QUIT_CONVO_PRE";
      }
    }

    if (content[currentState]["referenceStore"]){
      message = store.user['data'][content[currentState]["referenceStore"]];
    }

    currentState = content[currentState].nextMessage

    if (typeof currentState === 'object' &&
        (currentState[message.toLowerCase()] ||
        currentState[message])){
        currentState = (Number(message) === NaN) ? currentState[message.toLowerCase()] : currentState[message];

    } else if (typeof currentState === 'object' && currentState["*"]){
      currentState = currentState["*"];

    } else if (typeof currentState === 'object' &&
               currentState[message.toLowerCase()] === undefined) {
      currentState = "STEP:UNKNOWN_INPUT";

    } else if (Store.getFlags(fbID).length > 0){
      console.log('FLAGGED');
      console.log("flags: ", Store.getFlags(fbID))
      currentState = "STEP:UNKNOWN_INPUT";
      Store.flushFlags(fbID);

    } else if (currentState === "STEP:LAST_STEP"){
      store.user['state'].forEach(function(state){
        if (content[state]["anchor"] && content[state]["anchor"] === true){
          currentState = state;
        }
      });
    }

    if (message === "retry"){
      let newCurrentState;
      store.user['state'].forEach(function(state){
        if (content[state]["anchor"] && content[state]["anchor"] === true){
          currentState = newCurrentState;
          newCurrentState = state;
        }
      });
    }
    Store.appendState(currentState, fbID);
  },

  reRoute(message, fbID){
    if (isString(message) && message === "Search Again"){
      currentState = "STEP:QUE_LOCATION_RETRY";
      Store.appendState(currentState, fbID);

    } else if (isString(message) && message === "resume" && currentState !== "NAV_MENU"){
      let lastStateIndex = store.user['state'].length;
      currentState = Store.users['state'][lastStateIndex - 2];
      Store.appendState(currentState, fbID);

    } else if (isString(message) && message.toLowerCase() === "restart" || message === greetingVar){
      console.log('RESETTING CONVERSATION')
      currentState = Store.resetState(fbID);
      Store.appendState(currentState, fbID);
      SeedAppService.createIncident(fbID)

    } else if (isString(message) && message.toLowerCase() === "new report"){
      currentState = Store.resetState(fbID);
      Store.appendState(currentState, fbID);
      SeedAppService.createIncident(fbID)

    } else {
      SeedAppService.logIncidentData(fbID);
    }
  },

  get(fbID) {
    currentState = Store.getState(fbID);

    // console.log('GET STATE: ', currentState)
    return content[currentState];
  }

};

function isString(message) {
  return typeof message === "string";
}
