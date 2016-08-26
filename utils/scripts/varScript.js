"use strict";

const store = require('../store')

swapVar = function(message, userInput){
  let iOne = message["text"].indexOf('${') + 3;
  let iTwo = message["text"].indexOf('}') - 1;
  let dynamicContent = message["text"].substr(iOne, (iTwo - iOne));
  let finalResponse = message["text"].replace("${'" + dynamicContent + "'}", varStore[dynamicContent]);
  return finalResponse
}

saveVar = function(key, message){
  store[key] = variable;
}

module.exports = function(currentFrame, userInput){
  saveVar(currentFrame.["responseKey"], userInput) if currentFrame["responseKey"];
  return swapVar(currentFrame["text"], userInput) if message["text"].includes("${");
}
