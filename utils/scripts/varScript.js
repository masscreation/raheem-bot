"use strict";

const store = require('../store')

function swapVar(message){
  let iOne = message.indexOf('${') + 3;
  let iTwo = message.indexOf('}') - 1;
  let dynamicContent = message.substr(iOne, (iTwo - iOne));
  let finalResponse = message.replace("${'" + dynamicContent + "'}", store[dynamicContent]);
  return finalResponse
}

module.exports = {

  type(){
    return "varScript"
  },

  digest(currentFrame, message){
    return new Promise(function(resolve, reject){
      if (currentFrame["responseKey"]) {
        store[currentFrame["responseKey"]] = message;
        console.log("SAVE VAR", store[currentFrame["responseKey"]])
      }
      resolve();
    })
  },

  format(currentFrame){
    if (currentFrame["text"] && currentFrame["text"].includes("${")){
      currentFrame["text"] = swapVar(currentFrame["text"]);
      console.log("SWAPVAR", currentFrame);
      return currentFrame
    } else {
      return currentFrame
    }
  }
}
