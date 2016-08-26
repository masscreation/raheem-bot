'use strict'

const content = require('../content');
const state = require('./stateMachine');
const store = require('./store')
const varScript = require('./scripts/varScript')

let currentState


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
        console.log("incomingPayload: ", incomingPayload);

        currentState = state.get();

        //run varscript
        varScript(content[currentState], incomingPayload);
        console.log('here')

        state.next();
        
        currentState = state.get();

        console.log("STATE: ", currentState);
        // this is where the smarts is gonna happen, do we call a script
        // or send to wit.ai  or something else
        // what do we send back: text, objects, etc.

        let outgoingObj = content[currentState];

        outgoingObj = varScript(content[currentState], outgoingObj);

        console.log("Outgoing Object: ", outgoingObj);

        resolve(outgoingObj);

      } else {
        reject(new Error('something went wrong in the convoEngine'))
      }

    });
  }

};
