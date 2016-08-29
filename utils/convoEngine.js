'use strict'

const content = require('../content');
const state = require('./stateMachine');
const store = require('./store')
const varScript = require('./scripts/varScript')
const messageThread = require('./scripts/messageThread')
const scriptEngine = require('./scriptEngine')

let currentState, outgoingMessageObj;

/*
 * Collection of methods to managing the convo
 *
 */

module.exports = {

  // 1. Consult the conversation state
  // 2. Check if the user message is valid for this state
  // 3. Process user message if necessary
  // 4. Get the next piece of content
  // 5. Send out next piece of content
  //    a. define & format content-out components

  send(incomingPayload) {

    if (typeof incomingPayload !== "string") {
			return Promise.reject(new Error('message is not a string'));
		}

		return new Promise(function(resolve, reject) {

      if (incomingPayload) {
        console.log("Incoming Payload: ", incomingPayload);
        currentState = state.get();
        
        scriptEngine.digest(content[currentState], incomingPayload);

        state.next(incomingPayload);

        currentState = state.get();
        console.log("STATE: ", currentState);

        outgoingMessageObj = scriptEngine.format(content[currentState], content[currentState]);
        console.log("Outgoing Payload: ", outgoingMessageObj);

        let outgoingMessages = messageThread.set(outgoingMessageObj);
        resolve(outgoingMessages);

      } else {
        reject(new Error('something went wrong in the convoEngine'));

      }

    });
  }

};
