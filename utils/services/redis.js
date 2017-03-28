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
    console.log("GETTING USER BLOB")
    return new Promise(function(resolve, reject) {
      let strID = JSON.stringify(fbID);
      client.exists(strID, function(err, reply) {
        if (reply === 1) {
          user = JSON.parse(client.hmget(strID));
          console.log('OLD USER: ', user)
          resolve(user);
        } else {
          user = { 'dbID':     dbID,
                    'data':     {},
                    'flags':    [],
                    'state':    ['STEP:1_GET_STARTED_PAYLOAD'],
                    'archived': {},
                    'active':   null
                  }
          console.log('NEW USER: ', user)
          resolve(user);
        }
      });
    });
  },

  saveUserBlob(fbID) {
    return new Promise(function(resolve, reject) {
      let strID = JSON.stringify(fbID);
      client.hmset(strID, JSON.stringify(this.user), function(err, reply){
        resolve();
      });
    });
  }
}
