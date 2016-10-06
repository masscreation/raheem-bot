"use strict";

const store = require('../store')

function swapVar(message, fbID){
  let messageArray = message.split(" ");
  messageArray =  messageArray.map(function(word){
    if (word.includes("${")){
      let iOne = word.indexOf('${') + 3;
      let iTwo = word.indexOf('}') - 1;
      let dynamicContent = word.substr(iOne, (iTwo - iOne));
      word = store.getDatapoint(dynamicContent, fbID);
    }
    return word
  });
  return messageArray.join(" ");
}

module.exports = {

  type(){
    return "varScript"
  },

  digest(currentFrame, message, fbID){
    return new Promise(function(resolve, reject){
      if (currentFrame["responseKey"]) {
        store.saveDatapoint(currentFrame["responseKey"], message, fbID);
        console.log("VARIABLE SAVED: ", message)
      }
      resolve();
    })
  },

  format(currentFrame, fbID){
    if (currentFrame["text"] && currentFrame["text"].includes("${")){
      currentFrame = Object.assign({}, currentFrame);
      currentFrame["text"] = swapVar(currentFrame["text"]), fbID;
      console.log("VARIABLE SWAPPED, NEW MESSAGE: ", currentFrame["text"]);
      return currentFrame
    } else {
      return currentFrame
    }
  }
}
