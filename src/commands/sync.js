const { sync } = require('../ttn-api');
const ora = require('ora');
const figures = require('figures');
const debug = require('debug')('ttn:devices');

async function syncCommand({ ttn, logger = console }) {
	let { appID, appAccessKey } = ttn || {};

	try {
		sync({ appID, appAccessKey });
	} catch (error) {
		spinner.fail('Failed synchronizing...');
		logger.error(error);
		console.error(error);
	}
}

module.exports = { sync: syncCommand };
