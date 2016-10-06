"use strict";
//
// if (process.env.REDISTOGO_URL) {
//   let rtg = require("url").parse(process.env.REDISTOGO_URL);
//   client = require("redis").createClient(rtg.port, rtg.hostname);
//   client.auth(rtg.auth.split(":")[1]);
// } else {
//   client = require("redis").createClient();
// }

class StoreInterface {

  constructor(data) {
    this.users = {};
  }

  setUser(dbID, fbID) {
    if (!this.users[fbID]){
      this.users[fbID] = { 'dbID':     dbID,
                           'data':     {},
                           'flags':    [],
                           'state':    ['STEP:1_GET_STARTED_PAYLOAD'],
                           'archived': {},
                           'active':   null
                          }
    }
    console.log('SET USER', this.users[fbID])
  }

  getData(fbID) {
    return this.users[fbID]['data'];
  }

  getUserID(fbID) {
    return this.users[fbID]['dbID'];
  }

  getDatapoint(key, fbID) {
    return this.users[fbID]['data'][key];
  }

  saveDatapoint(key, value, fbID) {
    return this.users[fbID]['data'][key] = value;
  }

  appendState(frame, fbID) {
    let state = this.users[fbID]['state']
    state.push(frame);
  }

  getState(fbID) {
    let state = this.users[fbID]['state'];
    return state[state.length - 1];
  }

  resetState(fbID) {
    this.users[fbID]['state'] = ['STEP:1_GET_STARTED_PAYLOAD'];
    return this.users[fbID]['state'][0];
  }

  saveData(fbID) {
    this.users[fbID]['active'] = this.data;
  }

  archiveData(fbID) {
    let d = new Date();
    if (!this.users[fbID]['archived']){
      this.users[fbID]['archived'] = {};
    }
    this.users[fbID]['archived'][d.getTime()] = this.users[fbID]['data'];
    this.users[fbID]['data'] = {};
  }

  addFlag(fbID) {
    this.users[fbID]['flags'].push(flag)
  }

  flushFlags(fbID) {
    this.users[fbID]['flags'] = [];
  }
};

const Store = new StoreInterface;

module.exports = Store;


// if (process.env.REDISTOGO_URL) {
//   let rtg = require("url").parse(process.env.REDISTOGO_URL);
//   client = require("redis").createClient(rtg.port, rtg.hostname);
//   client.auth(rtg.auth.split(":")[1]);
// } else {
//   client = require("redis").createClient();
// }
//
// let Store = function(){
//   this.data = {};
//   this.users = {};
//   this.flag = null;
//   this.state = [];
// };
//
//
// Store.prototype.addFlag = function(flag){
//   this.tempStore.flags.push(flag);
// };
//
// Store.prototype.removeFlag = function(){
//   this.tempStore.flags = [];
// };
//
// Store.prototype.appendState = function(){
//   client.
// }
//
// let findOrCreateUser = function(){
//   client.get(id, function(err, reply) {
//     if (reply) {
//       this.tempStore.currentUser = reply;
//     } else {
//       this.tempStore.currentUser = seedAppApi.createUser(id);
//     }
//   }
// }
//
//
// let saveIntoMem = function(){
//   client.hset("users", JSON.stringify(`${store.currentSong}`),
//                             JSON.stringify(store.tempStore[`${store.currentSong}`]),
//                function(err, reply) {
//                  console.log(reply);
//                });
// };
//
//
// Store.prototype.updateTemp = function(message){
//   saveTempStore(message, this);
// };
//
// Store.prototype.logTemp = function(id){
//   if (this.currentSong !== null) {
//     saveIntoMem(this);
//   }
// };
//
// Store.prototype.getSongs = function(){
//   getFingerprints(this.solidStore);
// };
