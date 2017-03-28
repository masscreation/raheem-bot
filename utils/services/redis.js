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
      client.exists(strID, function(err, reply) {
        if (reply === 1) {
          client.get(strID, function(err, blob) {
            resolve(JSON.parse(blob));
          });
        } else {
          resolve({ 'dbID':     dbID,
                    'data':     {},
                    'flags':    [],
                    'state':    ['STEP:1_GET_STARTED_PAYLOAD'],
                    'archived': {},
                    'active':   null,
                    'test':     false
                  });
        }
      });
      // client.get(strID, function(err, reply) {
      //   if (reply) {
      //     console.log('SAVED USER: ', reply)
      //     resolve(JSON.parse(reply));
      //   } else {
      //     console.log('ERROR, ERROR! ', err);
      //     console.log('NEW USER');
      //     resolve({ 'dbID':     dbID,
      //               'data':     {},
      //               'flags':    [],
      //               'state':    ['STEP:1_GET_STARTED_PAYLOAD'],
      //               'archived': {},
      //               'active':   null
      //             });
      //   }
      // });
    });
  },

  saveUserBlob(fbID, blob) {
    return new Promise(function(resolve, reject) {
      let strID = JSON.stringify(fbID);
      client.set(strID, JSON.stringify(blob), function(err, reply){
        if (err) {
          console.log("ERROR: ", err)
        } else {
          console.log("REPLY: ", reply)
        }
        resolve();
      });
    });
  }
}
