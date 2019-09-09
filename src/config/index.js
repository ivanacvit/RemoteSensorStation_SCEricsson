const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

module.exports = {
	ttn: {
		appID: process.env.TTN_APP_ID,
		appAccessKey: process.env.TTN_ACCESS_KEY
	},

	ui: {
		spinner: 'dots'
	},

	logger: require('./logger.js'),

	params: require('./parameters.js')
};
