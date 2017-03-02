"use strict";

const seedAppService = require('../services/seedAppApi');

module.exports = {

  type(){
    return "attachmentScript"
  },

  digest(currentFrame, message, fbID){
    return new Promise(function(resolve, reject){
      if (message[0] && message[0].payload) {
        seedAppService.sendAttachment(message[0].payload.url, fbID);
      }
      resolve();
    });
  },

  format(currentFrame){
    return currentFrame;
  }
}
