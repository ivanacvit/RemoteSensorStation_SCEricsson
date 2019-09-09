const { prompt } = require('inquirer');
const { send } = require('../ttn-api');
const ora = require('ora');
const debug = require('debug')('ttn:send');
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
		name: 'paramID',
		message: 'Parameter ID:',
		validate: (input) => {
			const paramID = parseInt(input);
			return paramID >= 0 && paramID < 256 ? true : 'ParamID should be a number in [0,...,255]';
		}
	},
	{
		type: 'input',
		name: 'paramValue',
		message: 'Parameter value:',
		validate: (input) => {
			return input ? true : 'Missing parameter value';
		}
	},
	{
		type: 'confirm',
		name: 'continue',
		message: 'More parameters or devices:',
		default: false
	}
];

/**
 * Collects messages and to be sent to specific devices.
 * Calls TTN send api and also handles ui.
 * @param {Object} param0 a config object
 */
async function sendCommand({ ttn, logger = console }) {
	let { appID, appAccessKey } = ttn || {};
	let answers;
	let lastDeviceID = undefined;
	const messages = {};

	// Alternatively one can use recursive prompt
	// (https://github.com/SBoudrias/Inquirer.js/tree/master/packages/inquirer/examples)
	do {
		answers = await prompt(questions(lastDeviceID));

		const { deviceID, paramID, paramValue } = answers;
		lastDeviceID = deviceID;

		messages[deviceID]
			? messages[deviceID].push({ paramID, paramValue })
			: (messages[deviceID] = [ { paramID, paramValue } ]);
	} while (answers.continue);

	const spinner = ora('Sending...').start();
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

				if (id > 100 && id <= 120) {
					const size = parameters[100]['size'];
					params = Buffer.alloc(1 + size);
					params[0] = id;
					params.writeIntLE(value, 1, size);
					buffer = Buffer.concat([ buffer, params ]);
				} else {
					const size = parameters[id]['size'];
					params = Buffer.alloc(1 + size);
					params[0] = id;
					params.writeIntLE(value, 1, size);
					buffer = Buffer.concat([ buffer, params ]);
				}
			});

			console.log('\n', buffer);
			send({ appID, appAccessKey, buffer }, key);
		});
		//const result = await send({ appID, appAccessKey, buffer });
		spinner.succeed('Successfully sent messages');
		//printDevices(result);
	} catch (error) {
		spinner.fail('Failed sending...');
		logger.error(error);
		console.error(error);
	}
}

module.exports = { send: sendCommand };
