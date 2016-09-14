"use strict";

const store = require('../store')

require('datejs');

module.exports = {

  type(){
    return "dateScript"
  },

  digest(currentFrame, message){
    return new Promise(function(resolve, reject){
      let date = store.data[currentFrame["responseKey"]];

      if (Date.parse(date) !== null){
        date = Date.parse(date).toString('MMMM dS, yyyy');
      } else {
        store.flags = "ERROR:INVALID_DATE";
      }

      console.log("Date update: ", date);

      store.data[currentFrame["responseKey"]] = date;
      resolve();
    });
  },

  format(currentFrame){
    return currentFrame
  }
}
