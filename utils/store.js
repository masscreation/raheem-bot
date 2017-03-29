"use strict";

class StoreInterface {

  constructor(data) {
    this.users = {};
  }

  setUser(fbID, blob) {
    this.users[fbID] = blob;
  }

  getUser(fbID) {
    console.log("GET USER: ", this.users[fbID])
    return this.users[fbID];
  }

  isNotTest(fbID) {
    return !this.users[fbID]['test'];
  }

  setTest(fbID, bool) {
    this.users[fbID]['test'] = bool;
  }

  getActiveSurveyId(fbID) {
    console.log('FIND ID: ', this.users[fbID]["currentSurveyID"]);
    return this.users[fbID]["currentSurveyID"];
  }

  saveActiveSurveyId(fbID, surveyID) {
    this.users[fbID]["currentSurveyID"] = surveyID;
    console.log('SAVE ACTIVE ID', this.users[fbID]["currentSurveyID"]);
  }

  getData(fbID) {
    return this.users[fbID]['data'];
  }

  getUserID(fbID) {
    console.log('GOT USER: ', this.users[fbID]['dbID']);
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
    this.users[fbID]['currentSurveyID'] = null;
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
