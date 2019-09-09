const debug = require('debug')('ttn:api-send');
const { data } = require('ttn');

const send_timeout = 1000;
async function send({ appID, appAccessKey, buffer }, deviceID) {
	await data(appID, appAccessKey)
		.then(function(client) {
			client.on('uplink', deviceID, function(devID, payload) {
				//console.log('Received uplink from ', devID); /** devID listens all devices*/
				//console.log(payload);
				client.send(deviceID, buffer, 1);

				setTimeout(function() {
					client.close(true);
				}, send_timeout);
				debug('sent');
			});
		})
		.catch(function(err) {
			console.error(err);
			process.exit(1);
		});
}

module.exports = { send };
