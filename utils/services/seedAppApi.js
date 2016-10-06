'use strict'

const config = require('config');
const request = require('request');
const content = require('../../content');
const Store = require('../store');

// Google places api key
// https://developers.google.com/places/web-service/get-api-key
const SEED_BOT_WRITE_KEY = (process.env.SEED_BOT_WRITE_KEY) ?
  process.env.SEED_BOT_WRITE_KEY :
  config.get('seedBotWriteKey');

module.exports = {

  getOrCreateUser(messagingEvent) {
    return new Promise(function(resolve, reject) {
      let fbID = messagingEvent.sender.id
      request({
        uri: 'https://theseedapp.com/api/v1/users/generate',
        qs: { facebook_id: fbID },
        rejectUnauthorized: false,
        method: 'POST'
      }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          let status = JSON.parse(body).meta;
          let response = JSON.parse(body).data;
          Store.setUser(response.id, fbID);
          resolve(messagingEvent);

        } else {
          reject(new Error('server error: ' + response.error));
        }
      })
    })
  },

  logIncident(){
    let payload = prepareIncidentPayload();
    request({
      uri: 'https://theseedapp.com/api/v1/incidents',
      qs: payload,
      rejectUnauthorized: false,
      method: 'POST'
    }, function (error, response, body) {
      console.log("BODY", body)
      if (!error && response.statusCode == 200) {

        let status = JSON.parse(body).meta;
        let response = JSON.parse(body).data;

        if (status == 200) {
          resolve(body)

        } else {
          reject(new Error('server error: ' + response.error))

        }
      }
    });
  },

  updateUser(){
    let payload = prepareUserPayload();

    let userID = Store.getUserID();

    request({
      uri: `https://theseedapp.com/api/v1/users/${userID}.json`,
      qs: payload,
      rejectUnauthorized: false,
      method: 'POST'
    }, function (error, response, body) {
      console.log("BODY", body)
      if (!error && response.statusCode == 200) {

        let status = JSON.parse(body).meta;
        let response = JSON.parse(body).data;

        if (status == 200) {
          resolve(body)

        } else {
          reject(new Error('server error: ' + response.error))

        }
      }
    });
  }
};

let prepareUserPayload = function() {

  let data = Store.getData();

  let payload = {
    user_id: userID,
    write_key: SEED_BOT_WRITE_KEY
  }

  data['USER_RACE'] ?  payload['race_id'] = data['USER_RACE'] : null;
  data['USER_GENDER'] ? payload['gender_id'] = data['USER_GENDER'] : null;
  data['USER_BIRTHDATE'] ? payload['birthday'] = data['USER_BIRTHDATE'] : null;

  return payload
}

let prepareIncidentPayload = function() {

  let data = Store.getData();
  let userID = Store.getUserID();

  let payload = {
    user_id: userID,
    write_key: SEED_BOT_WRITE_KEY
  }

  data['DATE_OF_INCIDENT'] ?  payload['start_time'] = data['DATE_OF_INCIDENT'] : null;
  data['ENCOUNTER_SENTIMENT'] ? payload['rating'] = parseInt(data['ENCOUNTER_SENTIMENT']) : null;
  data['FURTHER_DESCRIPTION'] ? payload['description'] = data['FURTHER_DESCRIPTION'] : null;
  data['ENCOUNTER_LOCATION'] ? payload['latitude'] = JSON.parse(data['ENCOUNTER_LOCATION'])["lat"] : null;
  data['ENCOUNTER_LOCATION'] ? payload['longitude'] = JSON.parse(data['ENCOUNTER_LOCATION'])["long"] : null;

  return payload
}
