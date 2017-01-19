'use strict'

// const config = require('config')
// const request = require('request')
// const content = require('../content')
const googlePlacesApi = require('../services/googlePlacesApi');
const store = require('../store');
const locationStore = {}
const Raven = require('raven');

/*
 * Collection of methods related to getting the users location
 *
 */
module.exports = {

	type(){
		return 'locationScript'
	},


	digest(currentFrame, message, fbID){
		console.log('MESSAGE :', message)
		console.log('MESSAGE LOCATION :', message[0]);
		Raven.context(function() {
			Raven.captureBreadcrumb({
				message: 'Saving coordinates for locationScript',
				category: 'locationScript',
				data: {
					message: message,
					currentFrame: currentFrame
				}
			});
			if(message[0].payload !== undefined && message[0].title !== 'Attachment Unavailable') {
				store.users[fbID]['data'][currentFrame["responseKey"]] = JSON.stringify(message[0].payload.coordinates);
			} else {
				store.users[fbID]['flags'].push("ERROR:INVALID_LOCATION");
			}
		});
	},

	//
	// digest(currentFrame, message){
	// 	return googlePlacesApi.callPlaceAutocompleteService(message).then(function(predictions){
	// 			if (predictions) {
	// 				locationStore["locationQueryResults"] = predictions;
	// 				console.log(`FOUND ${locationStore['locationQueryResults'].length} LOCATION RESULTS`)
	// 			}
	// 		});
	// },

	format(currentFrame, message, fbID){

		currentFrame["options"] = [
			{
				"content_type": "location"
			}
		]

		return currentFrame;
	}
}

	// format(currentFrame, message){
	// 		currentFrame["options"] = formatLocationResults(locationStore['locationQueryResults'])
	// 		return currentFrame;
	// 	}
	// }

// function getPredictions(query) {
// 	return googlePlacesApi.callPlaceAutocompleteService(query);
// }
//
// function formatLocationResults(results){
// 	results = results.map(function(result){
// 		return {
// 			"title": result.description,
// 			"buttons": [{
// 				"type": "postback",
// 				"contentType": "text",
// 				"text": "Confirm",
// 				"payload": result.description
// 			}]
// 		}
// 	});
// 	results.push({
// 		"title": "Location Not Listed",
// 		"buttons": [{
// 			"type": "postback",
// 			"text": "Search Again",
// 			"payload": "Search Again"
// 		}]
// 	});
// 	return results;
// }
// };
