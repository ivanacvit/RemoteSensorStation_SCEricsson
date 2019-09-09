const debug = require('debug')('ttn:api-read');
const { data } = require('ttn');

const read_timeout = 60000; /**Should be sleep period x2 */

async function read({ appID, appAccessKey, buffer }, deviceID) {
	let skipMessage = true;
	await data(appID, appAccessKey)
		.then(function(client) {
			client.send(deviceID, buffer, 1);
			const timer = setTimeout(() => {
				console.log('Timeout reached. No data received...');
				client.close(true);
			}, read_timeout);

			/**
 		 	 * Receive sensor payload (FF) -> skipMessage = true
			 * Receive payload (parameters value) -> skipMessage = false 
		 	 */
			client.on('uplink', deviceID, function(devID, payload) {
				if (devID === deviceID) {
					if (!skipMessage) {
						clearTimeout(timer);
						console.log(payload);
						console.log('Received payload: ', payload.payload_raw);

						client.close(true);
					}
					skipMessage = false;
				}
			});
		})
		.catch(function(err) {
			console.error(err);
			process.exit(1);
		});
}

module.exports = { read };
