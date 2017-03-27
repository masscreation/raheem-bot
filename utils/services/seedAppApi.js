'use strict'

const config = require('config');
const request = require('request');
const content = require('../../content');
const Store = require('../store');
const util = require('util');

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
        uri: 'https://www.raheem.ai/api/v1/users/generate',
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
    let userID = Store.getUserID(fbID);

    request({
      uri: 'https://www.raheem.ai/api/v1/incidents',
      qs: { user_id: userID,
            write_key: SEED_BOT_WRITE_KEY },
      rejectUnauthorized: false,
      method: 'POST'
    }, function(error, response, body) {
      if(!error && response.statusCode == 200) {
        let response = JSON.parse(body);
        if (response.data.id) {
          let id = response.data.id;
          Store.saveActiveSurveyId(fbID, id);
        }
      }
    });
  },

  createOfficer(fbID) {
    let payload = prepareOfficerPayload(fbID);

    request({
      uri: 'https://www.raheem.ai/api/v1/officers',
      qs: payload,
      rejectUnauthorized: false,
      method: 'POST'
    }, function(error, response, body) {
      if(!error && response.statusCode == 200) {
        let response = JSON.parse(body);
        console.log("OFFICER RESPONSE: ", response);
      }
    });
  },

  closeIncident(fbID) {
    let incidentId = Store.getActiveSurveyId(fbID);

    if (incidentId) {
      request({
        uri: `https://www.raheem.ai/api/v1/incidents/${incidentId}`,
        qs: {
              completed: true,
              write_key: SEED_BOT_WRITE_KEY
            },
        rejectUnauthorized: false,
        method: 'PATCH'
      }, function(error, response, body) {
        Store.archiveData(fbID, JSON.parse(body)["data"]["id"]);
        if(!error && response.statusCode == 200) {
        }
      });
    }
  },

  sendAttachment(url, fbID) {
    let incidentId = Store.getActiveSurveyId(fbID);

    if (incidentId) {
      request({
        uri: `https://www.raheem.ai/api/v1/attachments`,
        qs: {
              incident_id: incidentId,
              asset_url: url,
              write_key: SEED_BOT_WRITE_KEY
            },
        rejectUnauthorized: false,
        method: 'POST'
      }, function(error, response, body) {
        console.log("ERROR", error)
        console.log("BODY", body)
        if(!error && response.statusCode == 200) {
          console.log("success!");
        }
      });
    }
  },

  logIncidentData(fbID){

    let payload = prepareIncidentPayload(fbID);
    let incidentId = Store.getActiveSurveyId(fbID);

    if (incidentId) {
      request({
        uri: `https://www.raheem.ai/api/v1/incidents/${incidentId}`,
        qs: payload,
        rejectUnauthorized: false,
        method: 'PATCH'
      }, function (error, response, body) {
        if (!error && response.statusCode == 200) {

          let status = JSON.parse(body).meta;
          let response = JSON.parse(body).data;

          if (status == 200) {
            console.log("SUCCESSFUL UPDATE INCIDENT")
            return(body)

          } else {
            console.log('UNSUCCESSFUL UPDATE INCIDENT RESPONSE: ' + util.inspect(response, {showHidden: false, depth: null}))
            console.log('UNSUCCESSFUL UPDATE INCIDENT BODY: ' + util.inspect(body, {showHidden: false, depth: null}))
            console.log('UNSUCCESSFUL UPDATE INCIDENT ERROR: ' + util.inspect(error, {showHidden: false, depth: null}))
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
      uri: `https://www.raheem.ai/api/v1/users/${userID}`,
      qs: payload,
      rejectUnauthorized: false,
      method: 'PUT'
    }, function (error, response, body) {
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

  data['USER_RACE'] ?  payload['race_name'] = data['USER_RACE'] : null;
  data['USER_GENDER'] ? payload['gender_name'] = data['USER_GENDER'] : null;
  data['USER_BIRTHDATE'] ? payload['birthday'] = data['USER_BIRTHDATE'] : null;

  return payload
}

let prepareOfficerPayload = function(fbID){
  let incidentID = Store.getActiveSurveyId(fbID);
  let data = Store.getData(fbID);
  let userID = Store.getUserID(fbID);

  let payload = {
    incident_id: incidentID,
    write_key: SEED_BOT_WRITE_KEY
  }

  data['OFFICER_NAME'] ?  payload['name'] = data['OFFICER_NAME'] : null;
  data['OFFICER_BADGE_NUMBER'] ? payload['badge_number'] = data['OFFICER_BADGE_NUMBER'] : null;
  data['OFFICER_GENDER'] ? payload['gender_name'] : null;
  data['OFFICER_RACE'] ? payload['race_name'] : null;
  data['OFFICER_DETAILS_DESCRIPTION'] ? payload['description'] = data['OFFICER_DETAILS_DESCRIPTION'] : null;

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
  data['INITIAL_CONTACT'] ? payload['incident_type_name'] = data['INITIAL_CONTACT'] : null
  data['DATE_OF_INCIDENT'] ?  payload['start_time'] = data['DATE_OF_INCIDENT'] : null;
  data['ENCOUNTER_SENTIMENT'] ? payload['rating'] = parseInt(data['ENCOUNTER_SENTIMENT']) : null;
  data['FURTHER_DESCRIPTION'] ? payload['description'] = data['FURTHER_DESCRIPTION'] : null;
  data['ENCOUNTER_LOCATION'] ? payload['latitude'] = JSON.parse(data['ENCOUNTER_LOCATION'])["lat"] : null;
  data['ENCOUNTER_LOCATION'] ? payload['longitude'] = JSON.parse(data['ENCOUNTER_LOCATION'])["long"] : null;
  data !== {} ? payload['metadata'] = JSON.stringify(data) : null;
  payload['reactions_list'] = [];
  data['USER_REACTION'] ? payload['reactions_list'].push(data['USER_REACTION']) : null;
  data['OFFICER_DISPOSITION'] ? payload['reactions_list'].push(data['OFFICER_DISPOSITION']) : null;
  payload['tags_list'] = [];
  data['CONTACT_OUTCOME'] ? payload['tags_list'].push(data['CONTACT_OUTCOME']) : null;

  return payload
}
