"use strict";

const store = require('../store')

function review(){
  let results = ''
  for (let keyVal in store) {
    results += `${keyVal}: ${store[keyVal]}\n`
  }
  return results
}

module.exports = {

  type(){
    return "dbScript"
  },

  digest(currentFrame, message){
  },

  format(currentFrame){
    currentFrame = Object.assign({}, currentFrame);
    currentFrame["text"] += review();
    return currentFrame
  }

}
