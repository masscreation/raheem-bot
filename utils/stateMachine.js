'use strict'

const store = require('./store')
const content = require('../content');
const initialState = "STEP:1_GET_STARTED_PAYLOAD";
let currentState = initialState;

/*
 * Collection of methods related to identifying where the user 'is' in the
 * flow of conversation with the bot
 */

module.exports = {

  next(message) {

    if (content[currentState]["referenceStore"]){
      message = store.data[content[currentState]["referenceStore"]];
      console.log("message", message)
    }

    currentState = content[currentState].nextMessage

    if (typeof currentState === 'object' && currentState[message.toLowerCase()]){
      currentState = currentState[message.toLowerCase()];

    } else if (typeof currentState === 'object' && currentState["*"]){
      currentState = currentState["*"];

    } else if (message.toLowerCase() === "stop" ||
        message.toLowerCase() === "exit" ||
        message.toLowerCase() === "goodbye" ||
        message.toLowerCase() === "quit" ||
    ){
      currentState = "STEP:QUIT_CONVO";

    } else if (typeof currentState === 'object' && currentState[message.toLowerCase()] === undefined){
      currentState = "STEP:UNKNOWN_INPUT";

    } else if (store.flag){
      currentState = "STEP:UNKNOWN_INPUT";

    } else if (currentState === "STEP:LAST_STEP"){
      store.state.forEach(function(state){
        if (content[state]["anchor"] && content[state]["anchor"] === true){
          currentState = state;
        }

      });
    }
    store.flag = null;
    store.state.push(currentState);

  },

  reRoute(message){

    if (typeof message === "string"){

      if (message.toLowerCase() === "stop" ||
          message.toLowerCase() === "exit" ||
          message.toLowerCase() === "goodbye" ||
          message.toLowerCase() === "quit" ||
         ){
        currentState = "STEP:QUIT_CONVO";

      } else if (message === "Search Again"){
        currentState = "STEP:QUE_LOCATION_RETRY";

      } else if (message === "resume" && currentState !== "NAV_MENU"){
        let lastStateIndex = store.state.length;
        currentState = store.state[lastStateIndex - 2];

      } else if (message.toLowerCase() === "restart"){
        currentState = store.state[0];

      } else if (message.toLowerCase() === "new report"){
        currentState = "STEP:RESTART_CONVO";

      }

    }

    console.log("GET STATE", currentState)
  },

  get() {
    return content[currentState];
  }

};
