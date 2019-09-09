const { prompt } = require('inquirer');
const { read } = require('../ttn-api');
const ora = require('ora');
const debug = require('debug')('ttn:read');
const parameters = require('../config/parameters.js');

/**
 * Dynamically generates prompt questions based on
 * the ID of the last configured device.
 * @param {*} lastDeviceID the ID of the last device
 */
const questions = (lastDeviceID) => [
	{
		type: 'input',
		name: 'deviceID',
		message: 'Device ID:',
		default: lastDeviceID ? lastDeviceID : undefined,
		validate: (input) => {
			return input ? true : 'Missing device ID';
		}
	},
	{
		type: 'input',
		name: 'paramValue',
		message: 'Parameter values:',
		validate: (input) => {
			return input ? true : 'Missing parameter value';
		}
	},
	{
		type: 'confirm',
		name: 'continue',
		message: 'More devices:',
		default: false
	}
];

/**
 * Collects messages and to be sent to specific devices.
 * Calls TTN read api and also handles ui.
 * @param {Object} param0 a config object
 */
async function readCommand({ ttn, logger = console }) {
	let { appID, appAccessKey } = ttn || {};
	let answers;
	let lastDeviceID = undefined;
	const messages = {};

	do {
		answers = await prompt(questions(lastDeviceID));
		const paramID = 15;
		const { deviceID, paramValue } = answers;
		lastDeviceID = deviceID;

		messages[deviceID]
			? messages[deviceID].push({ paramID, paramValue })
			: (messages[deviceID] = [ { paramID, paramValue } ]);
	} while (answers.continue);

	const spinner = ora('Reading...').start();
	try {
		/**
 		 * Format messages (parameters) before sending them 
		 */
		const keys = Object.keys(messages);

		keys.forEach(function(key) {
			lista_params = messages[key];
			let buffer = Buffer.alloc(0);

			lista_params.forEach(function(param) {
				const id = param['paramID'];
				const value = param['paramValue'];
				const size = parameters[id]['size'];

				let offset = 1;
				exceptionalParameter = value.split(',');
				const params = Buffer.alloc(1 + size * exceptionalParameter.length);
				params[0] = id;
				exceptionalParameter.forEach(function(parametar) {
					params.writeIntLE(parametar, offset++, size);
				});
				buffer = params;
			});

			console.log('\n', buffer);

			read({ appID, appAccessKey, buffer }, key);
		});
		spinner.succeed('Successfully sent messages');
	} catch (error) {
		spinner.fail('Failed reading...');
		logger.error(error);
		console.error(error);
	}
}

module.exports = { read: readCommand };
