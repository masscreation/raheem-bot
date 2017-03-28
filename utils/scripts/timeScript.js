"use strict";

const store = require('../store');
const date = require('datejs');

module.exports = {

  type(){
    return "timeScript";
  },

  digest(currentFrame, message, fbID){
    return new Promise(function(resolve, reject){
      const time = store.users[fbID]['data'][currentFrame["responseKey"]];

      if (!testTime(time)){
        store.users[fbID]['flags'].push("ERROR:INVALID_TIME");
      }
      store.users[fbID]['data'][currentFrame["responseKey"]] = time;

      resolve();
    })
  },

  format(currentFrame){
    return currentFrame
  }
}


function testTime(time) {
  return testLongTime(time) || testShortTime(time);
}

function testShortTime(time) {
  const regex = /^([0]?[1-9]|1[0-2])\s?(AM|PM)?$/i;
  return regex.test(time)
}

function testLongTime(time) {
  const regex = /^([0]?[1-9]|1[0-2]):([0-5]\d)\s?(AM|PM)?$/i;
  return regex.test(time);
}
