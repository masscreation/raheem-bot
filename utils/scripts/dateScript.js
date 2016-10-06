"use strict";

const store = require('../store')

require('datejs');

module.exports = {

  type(){
    return "dateScript"
  },

  digest(currentFrame, message, fbID){
    return new Promise(function(resolve, reject){
      let date = store.users[fbID]['data'][currentFrame["responseKey"]];

      if (Date.parse(date) !== null){
        date = Date.parse(date).toString('yyyy-M-d');
        date = new Date(date).valueOf() / 1000;
      } else {
        store.users[fbID]['flags'] = "ERROR:INVALID_DATE";
      }

      console.log("Date update: ", date);

      store.users[fbID]['data'][currentFrame["responseKey"]] = date;
      resolve();
    });
  },

  format(currentFrame){
    return currentFrame
  }
}
