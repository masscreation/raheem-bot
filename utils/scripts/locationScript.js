'use strict'

const store = require('../store');
const Raven = require('raven');

module.exports = {

	type(){
		return 'locationScript';
	},

	digest(currentFrame, message, fbID) {
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
				store.user['data'][currentFrame["responseKey"]] = JSON.stringify(message[0].payload.coordinates);
			} else {
				store.user['flags'].push("ERROR:INVALID_LOCATION");
			}
		});
	},

	format(currentFrame, message, fbID){

		currentFrame["options"] = [
			{
				"content_type": "location"
			}
		]

		return currentFrame;
	}
}
