const debug = require('debug')('ttn:api-send');
const { application } = require('ttn');

async function devices({ appID, appAccessKey }) {
	const applicationClient = await application(appID, appAccessKey);
	return applicationClient.devices();
}

module.exports = { devices };
