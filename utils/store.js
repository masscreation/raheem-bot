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
                           'active':   null,
                           'test': false
                          }
    }
    console.log('SET USER', this.users[fbID])
  }

  isNotTest(fbID) {
    return this.users[fbID]['test'];
  }

  setTest(fbID) {
    this.users[fbID]['test'] = true;
  }

  getActiveSurveyId(fbID) {
    return this.users[fbID]["currentSurveyID"];
  }

  saveActiveSurveyId(fbID, surveyID) {
    this.users[fbID]["currentSurveyID"] = surveyID;
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
    this.users[fbID]['data'] = {};
    this.users[fbID]['test'] = false;
    return this.users[fbID]['state'][0];
  }

  saveData(fbID) {
    this.users[fbID]['active'] = this.data;
  }

  archiveData(fbID, surveyID) {
    if (!this.users[fbID]['archived']){
      this.users[fbID]['archived'] = {};
    }
    this.users[fbID]['archived'][surveyID] = this.users[fbID]['data'];
  }

  addFlag(fbID) {
    this.users[fbID]['flags'].push(flag)
  }

  getFlags(fbID) {
    return this.users[fbID]['flags'];
  }

  flushFlags(fbID) {
    this.users[fbID]['flags'] = [];
  }
};

const Store = new StoreInterface;

module.exports = Store;
