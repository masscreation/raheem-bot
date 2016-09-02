'use strict'

// const config = require('config')
// const request = require('request')
// const content = require('../content')
const googlePlacesApi = require('../services/googlePlacesApi');
const store = require('../store');
const locationStore = {}
/*
 * Collection of methods related to getting the users location
 *
 */
module.exports = {

	type(){
		return 'locationScript'
	},

	digest(currentFrame, message){
		return googlePlacesApi.callPlaceAutocompleteService(message).then(function(predictions){
				if (predictions) {
					locationStore["locationQueryResults"] = predictions;
					console.log(`FOUND ${locationStore['locationQueryResults'].length} LOCATION RESULTS`)
				}
			});
	},

	format(currentFrame, message){
			currentFrame["options"] = formatLocationResults(locationStore['locationQueryResults'])
			return currentFrame;
		}
	}





// function(currentFrame, message){
//
// 	return new Promise(function(resolve, reject) {
//
// 	let finalResults;
//
// 		if (currentFrame.scripts && currentFrame.scripts.indexOf('location') !== -1){
// 			console.log("SELECTION", message);
// 			console.log("currentFrame", currentFrame);
// 			console.log("Current State", currentFrame.state)
//
// 			if (currentFrame.state === 'question'){
//
// 				getPredictions(message).then(function(results){
// 					let formattedResults = formatLocationResults(results);
// 					store['locationQueryResults'] = formattedResults;
// 					resolve();
// 				}).catch(function(err) {
// 					reject(err.message)
// 					console.log(err.message);
// 				});
//
// 			} else if (currentFrame.state === 'selection'){
// 				finalResults = store['locationQueryResults'];
// 				if (finalResults) {
// 					resolve(finalResults);
// 				} else {
// 					reject(new Error('could not get results froms store'));
// 				}
// 				return finalResults;
// 			}
// 		}
// 	});
// }

	/*
	 * Create a generic template from an array of location predictions
	 * https://developers.facebook.com/docs/messenger-platform/send-api-reference/generic-template
	 */

function getPredictions(query) {
	return googlePlacesApi.callPlaceAutocompleteService(query);
}

function formatLocationResults(results){
	results = results.map(function(result){
		return {
			"title": result.description,
			"buttons": [{
				"type": "postback",
				"contentType": "text",
				"text": "Confirm",
				"payload": result.description
			}]
		}
	});
	results.push({
		"title": "Location Not Listed",
		"buttons": [{
			"type": "postback",
			"text": "Search Again",
			"payload": "Search Again"
		}]
	});
	return results;
}
// };
