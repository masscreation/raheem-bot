"use strict";
//
let client;

if (process.env.REDISTOGO_URL) {
  let rtg = require("url").parse(process.env.REDISTOGO_URL);
  client = require("redis").createClient(rtg.port, rtg.hostname);
  client.auth(rtg.auth.split(":")[1]);
} else {
  client = require("redis").createClient();
}

module.exports = {

  getUserBlob(dbID, fbID) {
    return new Promise(function(resolve, reject) {
      let strID = JSON.stringify(fbID);
      client.get(strID, function(err, reply) {
        if (reply) {
          console.log('SAVED USER: ', reply)
          resolve(JSON.parse(reply));
        } else {
          console.log('NEW USER');
          resolve({ 'dbID':     dbID,
                    'data':     {},
                    'flags':    [],
                    'state':    ['STEP:1_GET_STARTED_PAYLOAD'],
                    'archived': {},
                    'active':   null
                  });
        }
      });
    });
  },

  saveUserBlob(fbID, blob) {
    return new Promise(function(resolve, reject) {
      let strID = JSON.stringify(fbID);
      client.hmset(strID, JSON.stringify(blob), function(err, reply){
        resolve();
      });
    });
  }
}
