"use strict";

const seedAppService = require('../services/seedAppApi');

module.exports = {

  type(){
    return "attachmentScript"
  },

  digest(currentFrame, message, fbID){
    return new Promise(function(resolve, reject){
      if (message.url) {
        seedAppService.sendAttachment(message.url, fbID);
      }
      resolve();
    });
  },

  format(currentFrame){
    return currentFrame;
  }
}
