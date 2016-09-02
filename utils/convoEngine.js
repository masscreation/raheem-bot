'use strict'

// const content = require('../content');
// const state = require('./stateMachine');
// const store = require('./store')
// const varScript = require('./scripts/varScript')
// const messageThread = require('./scripts/messageThread')
// const scriptEngine = require('./scriptEngine')
//
// let currentState, outgoingMessageObj, outgoingMessages;
//
// /*
//  * Collection of methods to managing the convo
//  *
//  */
//
// module.exports = {
//
//   // 1. Consult the conversation state
//   // 2. Check if the user message is valid for this state
//   // 3. Process user message if necessary
//   // 4. Get the next piece of content
//   // 5. Send out next piece of content
//   //    a. define & format content-out components
//
//   digestIncomingData(incomingPayload){
//
//     return new Promise(function(resolve, reject){
//
//       if (incomingPayload) {
//         currentState = state.get(incomingPayload);
//
//         let results = scriptEngine.digest(content[currentState], incomingPayload);
//         console.log("THIS SHOULD BE AFTER")
//
//         resolve(incomingPayload);
//       } else {
//         reject(new Error('something went wrong in digest'));
//
//       }
//     });
//   },
//
//   formatOutgoingData(incomingPayload){
//
//     return new Promise(function(resolve, reject){
//
//       state.next()
//
//       if (incomingPayload) {
//         currentState = state.get(incomingPayload);
//
//         outgoingMessageObj = scriptEngine.format(content[currentState]);
//         console.log("Outgoing Payload: ", outgoingMessageObj);
//
//         outgoingMessages = messageThread.set(outgoingMessageObj);
//         resolve(outgoingMessages);
//       } else {
//         reject(new Error('something went wrong in format'));
//       }
//     });
//
//   }
//
// };
