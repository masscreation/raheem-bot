'use strict'

// const config = require('config')
// const request = require('request')
// const content = require('../content')
const googlePlacesApi = require('../services/googlePlacesApi');
const store = require('../store');
/*
 * Collection of methods related to getting the users location
 *
 */
module.exports = function(currentFrame, message){

	return new Promise(function(resolve, reject) {

	let finalResults;

		if (currentFrame.scripts && currentFrame.scripts.indexOf('location') !== -1){
			console.log("SELECTION", message);
			console.log("currentFrame", currentFrame);
			console.log("Current State", currentFrame.state)

			if (currentFrame.state === 'question'){

				getPredictions(message).then(function(results){
					let formattedResults = formatLocationResults(results);
					store['locationQueryResults'] = formattedResults;
					resolve();
				}).catch(function(err) {
					reject(err.message)
					console.log(err.message);
				});

			} else if (currentFrame.state === 'selection'){
				finalResults = store['locationQueryResults'];
				if (finalResults) {
					resolve(finalResults);
				} else {
					reject(new Error('could not get results froms store'));
				}
				return finalResults;
			}
		}
	});
}

	/*
	 * Create a generic template from an array of location predictions
	 * https://developers.facebook.com/docs/messenger-platform/send-api-reference/generic-template
	 */

function getPredictions(query) {
	return new Promise(function(resolve, reject) {
		let results = googlePlacesApi.callPlaceAutocompleteService(query);
		if (results){
			resolve(results);
		} else {
			reject(new Error('something went wrong in the google places api'))
		}
	});
}

function formatLocationResults(results){
	return results.map(function(result){
		return {
			"title": result.description,
			"buttons": {
				"type": "postback",
				"contentType": "text",
				"text": result.description,
				"payload": "CONTENT"
			}
		}
	});
}
// };
