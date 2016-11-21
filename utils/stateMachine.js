'use strict'

const Store = require('./store');
const SeedAppService = require('./services/seedAppApi');
const AnalyticsApi = require('./services/analyticsAppApi')
const content = require('../content');
const initialState = "STEP:1_GET_STARTED_PAYLOAD";
let currentState = initialState;

/*
 * Collection of methods related to identifying where the user 'is' in the
 * flow of conversation with the bot
 */

module.exports = {

  next(message, fbID) {
    currentState = Store.getState(fbID);

    if (!content[currentState]['loop'] ||
        content[currentState]['loop'] && content[currentState]["breakKey"] === message) {

      if (currentState === 'STEP:FINAL_INFO'){
        SeedAppService.logIncidentData(fbID);
        SeedAppService.updateUser(fbID);
        Store.archiveData(fbID);
        SeedAppService.closeIncident(fbID);
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
        message = Store.users[fbID]['data'][content[currentState]["referenceStore"]];
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

      } else if (Store.flag){
        currentState = "STEP:UNKNOWN_INPUT";

      } else if (currentState === "STEP:LAST_STEP"){
        Store.users[fbID]['state'].forEach(function(state){
          if (content[state]["anchor"] && content[state]["anchor"] === true){
            currentState = state;
          }
        });
      }

      if (message === "retry"){
        let newCurrentState;
        Store.users[fbID]['state'].forEach(function(state){
          if (content[state]["anchor"] && content[state]["anchor"] === true){
            currentState = newCurrentState;
            newCurrentState = state;
          }
        });
      }
    }
    Store.appendState(currentState, fbID);

  },

  reRoute(message, fbID){

    if (typeof message === "string"){

      if (message === "Search Again"){
        currentState = "STEP:QUE_LOCATION_RETRY";
        Store.appendState(currentState, fbID);

      } else if (message === "resume" && currentState !== "NAV_MENU"){
        let lastStateIndex = Store.users[fbID]['state'].length;
        currentState = Store.users['state'][lastStateIndex - 2];
        Store.appendState(currentState, fbID);

      } else if (message.toLowerCase() === "restart"){
        currentState = Store.resetState(fbID);
        Store.appendState(currentState, fbID);
        SeedAppService.createIncident(fbID)

      } else if (message.toLowerCase() === "new report"){
        currentState = Store.resetState(fbID);
        Store.appendState(currentState, fbID);
        SeedAppService.createIncident(fbID)

      }

    }

  },

  get(fbID) {
    currentState = Store.getState(fbID);

    console.log('GET STATE: ', currentState)
    return content[currentState];
  }

};
