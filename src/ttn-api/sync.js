const debug = require('debug')('ttn:api-sync');
const { data } = require('ttn');
const { application } = require('ttn');
const { getOffset } = require('../commands/utils/getOffset');
const { devices } = require('../ttn-api/devices');
const { printDevices } = require('../commands/devices');

let flagForSend = 0;
let TimeStamps = {};
let sendOffsets = {};
const interval_time = 10000;
const sync_timeout = 3000;

async function sync({ appID, appAccessKey }) {
	const result = await devices({ appID, appAccessKey });
	const numberOfDevices = printDevices(result);
	console.log('Broj registriranih uređaja je:', numberOfDevices);

	await data(appID, appAccessKey)
		.then(function(client) {
			client.on('uplink', function(devID, payload) {
				console.log('\n Received uplink from ', devID);
				//console.log(payload);
				/**
 		 		 * Collects gateway IDs, device IDs and timestamps ({ 'gateway': { device: timestamp } }).
		 		 */
				payload.metadata.gateways.forEach(function(data) {
					if (!TimeStamps[data.gtw_id]) {
						TimeStamps = { ...TimeStamps, [data.gtw_id]: {} };
					}
					TimeStamps[data.gtw_id] = { ...TimeStamps[data.gtw_id], [devID]: data.timestamp };

					console.log('TimeStamps', TimeStamps);
				});

				if (flagForSend) {
					/**
 		 			 * Format messages (parameters) before sending them
		 			 */
					Object.keys(offset).forEach((device) => {
						let deviceFlag = 0;
						deviceID = device;
						value = offset[deviceID];
						paramID = 1;

						param = Buffer.alloc(3);
						param[0] = paramID;

						param.writeIntLE(value, 1, 2);
						console.log('buffer: ', param);

						client.send(deviceID, param, 1);
						deviceFlag++;

						if ((deviceFlag = numberOfDevices)) {
							setTimeout(function() {
								client.close(true);
							}, sync_timeout);
						}
					});
				}
			});
		})
		.catch(function(err) {
			console.error(err);
			process.exit(1);
		});

	setInterval(function() {
		const maxGateway = findGateway();
		console.log('maxGateway: ', TimeStamps[maxGateway]);

		/** Gateway with max number of devices */
		const formatOffsets = { ...TimeStamps[maxGateway] };
		Object.keys(TimeStamps[maxGateway]).forEach((time) => {
			formatOffsets[time] = Math.floor(TimeStamps[maxGateway][time] / 1000000);
		});
		console.log('formatOffsets: ', formatOffsets);

		offset = getOffset(formatOffsets, numberOfDevices);
		console.log('offset: ', offset);
		sendOffsets = { ...offset };

		if (Object.keys(offset).length == numberOfDevices) flagForSend = 1; /** send messages */
	}, interval_time);
}

let gateway = undefined;

/**
 * Finds gateway with max number of devices
 */
function findGateway() {
	const keys = Object.keys(TimeStamps);
	console.log(keys);
	let max = 0;
	keys.forEach(function(key) {
		if (max < Object.keys(TimeStamps[key]).length) {
			max = Object.keys(TimeStamps[key]).length;
			gateway = key;
		}
	});
	return gateway;
}

module.exports = { sync };
