"use strict";

class StoreInterface {

  constructor(data) {
  }

  setUser(fbID, blob) {
    this.user = blob;
  }

  getUser(fbID) {
    return this.user;
  }

  isNotTest(fbID) {
    return this.user['test'];
  }

  setTest(fbID) {
    this.user['test'] = true;
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
    console.log('GOT USER: ', this.user['dbID']);
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
    this.user['test'] = false;
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
    this.user['flags'].push(flag)
  }

  getFlags(fbID) {
    return this.user['flags'];
  }

  flushFlags(fbID) {
    this.user['flags'] = [];
  }
};

const Store = new StoreInterface;

module.exports = Store;
