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

  constructor(data, users, flags, state) {
    this.data  = {};
    this.users = {};
    this.flags = [];
    this.state = [];
  }

  getData() {
    return this.data;
  }

  getUserID() {
    return this.users[this.currentUser]['dbID'];
  }

  setUser(dbID, fbID) {
    if (!this.users[fbID]){
      this.users[fbID] = { 'dbID': dbID }
    }
    this.currentUser = fbID;
  }

  getDatapoint(key) {
    return this.data[key];
  }

  saveDatapoint(key, value) {
    return this.data[key] = value;
  }

  appendState(frame) {
    this.state.push(frame);
  }

  resetState() {
    this.state = ['STEP:1_GET_STARTED_PAYLOAD'];
    return this.state[0];
  }

  saveData() {
    this.users[this.currentUser]['active'] = this.data;
  }

  archiveData() {
    let d = new Date();
    if (!this.users[this.currentUser]['archived']){
      this.users[this.currentUser]['archived'] = {};
    }
    this.users[this.currentUser]['archived'][d.getTime()] = this.data;
    this.data = {};
  }

  addFlag() {
    this.flags.push(flag)
  }

  flushFlags() {
    this.flags = [];
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
