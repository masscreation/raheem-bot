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

class StoreInterface {

  constructor(data) {
    this.users = {};
  }

  setUser(dbID, fbID) {
    let user = this.user;

    return new Promise(function(resolve, reject) {
      let strID = JSON.stringify(fbID);
      let user;
      client.exists(strID, function(err, reply) {
        if (reply === 1) {
          user = JSON.parse(client.hmget(strID));
          console.log('OLD USER: ', user)
          resolve();
        } else {
          user = { 'dbID':     dbID,
                        'data':     {},
                        'flags':    [],
                        'state':    ['STEP:1_GET_STARTED_PAYLOAD'],
                        'archived': {},
                        'active':   null
                      }
          console.log('NEW USER: ', user)
          resolve();
        }
      });
    )}
  }

  endTurn(fbID) {
    let strID = JSON.stringify(fbID);
    client.hmset(strID, JSON.stringify(this.user));
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
