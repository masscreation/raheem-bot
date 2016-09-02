"use strict";

const store = require('../store')

function swapVar(message){
  let messageArray = message.split(" ");
  messageArray =  messageArray.map(function(word){
    if (word.includes("${")){
      let iOne = word.indexOf('${') + 3;
      let iTwo = word.indexOf('}') - 1;
      let dynamicContent = word.substr(iOne, (iTwo - iOne));
      word = store[dynamicContent];
    }
    return word
  });
  return messageArray.join(" ");
}

module.exports = {

  type(){
    return "varScript"
  },

  digest(currentFrame, message){
    return new Promise(function(resolve, reject){
      if (currentFrame["responseKey"]) {
        store[currentFrame["responseKey"]] = message;
        console.log("VARIABLE SAVED: ", store[currentFrame["responseKey"]])
      }
      resolve();
    })
  },

  format(currentFrame){
    if (currentFrame["text"] && currentFrame["text"].includes("${")){
      currentFrame = Object.assign({}, currentFrame);
      currentFrame["text"] = swapVar(currentFrame["text"]);
      console.log("VARIABLE SWAPPED, NEW MESSAGE: ", currentFrame["text"]);
      return currentFrame
    } else {
      return currentFrame
    }
  }
}
