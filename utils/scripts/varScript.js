"use strict";

const store = require('../store')

function swapVar(message){
  let iOne = message.indexOf('${') + 3;
  let iTwo = message.indexOf('}') - 1;
  let dynamicContent = message.substr(iOne, (iTwo - iOne));
  let finalResponse = message.replace("${'" + dynamicContent + "'}", store[dynamicContent]);
  return finalResponse
}

function saveVar(key, message){
  store[key] = message;
}

module.exports = function(currentFrame, userInput){

  if (currentFrame["responseKey"]) {
    saveVar(currentFrame["responseKey"], userInput);
    console.log("saved variable to store")
  }

  if (currentFrame["text"] &&
      currentFrame["text"].includes("${")){
    currentFrame["text"] = swapVar(currentFrame["text"]);
    return currentFrame
  } else {
    return userInput
  }

}
