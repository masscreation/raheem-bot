"use strict";

const store = require('../store')

require('datejs');

module.exports = {

  type(){
    return "dateScript"
  },

  digest(currentFrame, message, fbID){
    return new Promise(function(resolve, reject){
      let date = store.user['data'][currentFrame["responseKey"]];
      if (Date.parse(date) !== null){
        date = Date.parse(date).toString('yyyy-M-d');
        date = new Date(date).valueOf() / 1000;
      } else if (date !== 'input date') {
        store.user['flags'] = "ERROR:INVALID_DATE";
      }

      store.user['data'][currentFrame["responseKey"]] = date;
      resolve();
    });
  },

  format(currentFrame){
    return currentFrame;
  }
}
