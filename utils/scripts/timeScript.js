"use strict";

const store = require('../store')

require('datejs');

module.exports = {

  type(){
    return "dateScript"
  },

  digest(currentFrame, message){
    return new Promise(function(resolve, reject){
      let time = store.data[currentFrame["responseKey"]];

      if (!validateTime(time)){
        store.flags.push("ERROR:INVALID_TIME");
      }

      store.data[currentFrame["responseKey"]] = date;
      resolve();
    })
  },

  format(currentFrame){
    return currentFrame
  }
}


function testTime( time ) {
  let regex = /^([0-1][0-9])\:[0-5][0-9]\s*[ap]m$/i;
  let match = time.match( regex );
  if ( match ) {
    let hour  = parseInt( match[1] );
    if ( !isNaN( hour) && hour <= 11 ) {
      return true;
    }
  }
  return false;
}
