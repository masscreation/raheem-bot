'use strict'

const config = require('config');
const request = require('request');
const content = require('../../content');
const Store = require('../store');

module.exports = {

  getOrCreateSurvey(fbID) {
    request({
      uri: `https://raheem-bot-analytics.herokuapp.com/api/v1/surveys?fb_id=${fbID}`,
      rejectUnauthorized: false,
      method: 'POST'
    }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log("SUCCESS!!!")
        return(messagingEvent);

      } else {
        return(new Error('server error: ' + response.error));
      }
    });
  },

  logState(state, fbID){
    request({
      uri: `https://raheem-bot-analytics.herokuapp.com/api/v1/steps?title=${state}&fb_id=${fbID}`,
      rejectUnauthorized: false,
      method: 'POST'
    }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log("SUCCESS!!!")
        if (status == 200) {
          return(body)

        } else {
          return(new Error('server error: ' + response.error))

        }
      }
    });
  },

  closeSurvey(fbID){
    return new Promise(function(resolve, reject) {
      request({
        uri: `https://raheem-bot-analytics.herokuapp.com/api/v1/surveys/{fbID}`,
        rejectUnauthorized: false,
        method: 'PATCH'
      }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          console.log("SUCCESS!!!")
          if (status == 200) {
            resolve(body);

          } else {
            reject(new Error('server error: ' + response.error));

          }
        }
      });
    });
  }
};
