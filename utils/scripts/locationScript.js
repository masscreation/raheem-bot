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

		store.data[currentFrame["responseKey"]] = JSON.stringify(message[0].payload.coordinates);


		console.log(store.data[currentFrame["responseKey"]])

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

	format(currentFrame, message){

		console.log("FORMATTING LOCATION")

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
