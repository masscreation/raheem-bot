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
        uri: 'https://raheem.ai/api/v1/users/generate',
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

  createIncident(fbID) {
    let payload = prepareIncidentPayload(fbID);

    request({
      uri: 'https://raheem.ai/api/v1/incidents',
      qs: payload,
      rejectUnauthorized: false,
      method: 'POST'
    }, function(error, response, body) {
      console.log("CREATE INCIDENT FEEDBACK")
      console.log("ERROR", error)
      console.log("RESPONSE", JSON.parse(body))
      if(!error && response.statusCode == 200) {
        let response = JSON.parse(body);
        console.log("DATA", response)
        if (response.id) {
          let id = response.id;
          console.log("ID", id)
          Store.saveActiveSurveyId(fbID, id);
        }
      }
    })
  },

  closeIncident(fbID) {
    let incidentId = Store.getActiveSurveyId(fbID);

    if (incidentId) {
      request({
        uri: `https://raheem.ai/api/v1/incidents/${incidentId}`,
        qs: {
              completed: true,
              write_key: SEED_BOT_WRITE_KEY
            },
        rejectUnauthorized: false,
        method: 'PATCH'
      }, function(error, response, body) {
        if(!error && response.statusCode == 200) {
        }
      })
    }
  },

  logIncidentData(fbID){

    let payload = prepareIncidentPayload(fbID);
    let incidentId = Store.getActiveSurveyId(fbID);

    console.log("PAYLOAD: ", payload)

    if (incidentId) {
      request({
        uri: `https://raheem.ai/api/v1/incidents/${incidentId}`,
        qs: payload,
        rejectUnauthorized: false,
        method: 'PATCH'
      }, function (error, response, body) {
        console.log("BODY", body)
        if (!error && response.statusCode == 200) {

          let status = JSON.parse(body).meta;
          let response = JSON.parse(body).data;

          if (status == 200) {
            return(body)

          } else {
            return(new Error('server error: ' + response.error))

          }
        }
      });
    }
  },

  updateUser(fbID){
    let payload = prepareUserPayload(fbID);

    let userID = Store.getUserID(fbID);

    request({
      uri: `https://raheem.ai/api/v1/users/${userID}`,
      qs: payload,
      rejectUnauthorized: false,
      method: 'PUT'
    }, function (error, response, body) {
      console.log("BODY", body);
      if (!error && response.statusCode == 200) {

        let status = JSON.parse(body).meta;
        let response = JSON.parse(body).data;

        if (status == 200) {
          return(body);

        } else {
          return(new Error('server error: ' + response.error));

        }
      }
    });
  }
};

let prepareUserPayload = function(fbID) {

  let data = Store.getData(fbID);
  let userID = Store.getUserID(fbID);

  let payload = {
    user_id: userID,
    write_key: SEED_BOT_WRITE_KEY
  }

  data['USER_RACE'] ?  payload['race_id'] = data['USER_RACE'] : null;
  data['USER_GENDER'] ? payload['gender_id'] = data['USER_GENDER'] : null;
  data['USER_BIRTHDATE'] ? payload['birthday'] = data['USER_BIRTHDATE'] : null;

  return payload
}

let prepareIncidentPayload = function(fbID) {

  let data = Store.getData(fbID);
  let userID = Store.getUserID(fbID);

  let payload = {
    user_id: userID,
    write_key: SEED_BOT_WRITE_KEY
  }

  //ADD START TIME TO DATE (FINISH DATE PARSING)
  data['DATE_OF_INCIDENT'] ?  payload['start_time'] = data['DATE_OF_INCIDENT'] : null;
  data['ENCOUNTER_SENTIMENT'] ? payload['rating'] = parseInt(data['ENCOUNTER_SENTIMENT']) : null;
  data['FURTHER_DESCRIPTION'] ? payload['description'] = data['FURTHER_DESCRIPTION'] : null;
  data['ENCOUNTER_LOCATION'] ? payload['latitude'] = JSON.parse(data['ENCOUNTER_LOCATION'])["lat"] : null;
  data['ENCOUNTER_LOCATION'] ? payload['longitude'] = JSON.parse(data['ENCOUNTER_LOCATION'])["long"] : null;

  return payload
}
