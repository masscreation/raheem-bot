"use strict";

class StoreInterface {

  constructor(data) {
  }

  setUser(fbID, blob) {
    this.user = blob;
  }

  getActiveSurveyId(fbID) {
    return this.user["currentSurveyID"];
  }

  saveActiveSurveyId(fbID, surveyID) {
    this.user["currentSurveyID"] = surveyID;
  }

  getData(fbID) {
    return this.user['data'];
  }

  getUserID(fbID) {
    return this.user['dbID'];
  }

  getDatapoint(key, fbID) {
    return this.user['data'][key];
  }

  saveDatapoint(key, value, fbID) {
    return this.user['data'][key] = value;
  }

  appendState(frame, fbID) {
    let state = this.user['state']
    state.push(frame);
  }

  getState(fbID) {
    let state = this.user['state'];
    return state[state.length - 1];
  }

  resetState(fbID) {
    this.user['state'] = ['STEP:1_GET_STARTED_PAYLOAD'];
    this.user['data'] = {};
    return this.user['state'][0];
  }

  saveData(fbID) {
    this.user['active'] = this.data;
  }

  archiveData(fbID, surveyID) {
    if (!this.user['archived']){
      this.user['archived'] = {};
    }
    this.user['archived'][surveyID] = this.user['data'];
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
