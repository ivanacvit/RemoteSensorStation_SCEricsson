const { prompt } = require('inquirer');
const { devices } = require('../ttn-api/devices');
const ora = require('ora');
const figures = require('figures');
const debug = require('debug')('ttn:devices');

/**
 * Prompt questions
 */
const questions = [
	{
		type: 'input',
		name: 'appID',
		message: 'Application ID:',
		validate: (input) => {
			return input ? true : 'Missing application ID';
		}
	},
	{
		type: 'input',
		name: 'appAccessKey',
		message: 'Application access key:',
		validate: (input) => {
			return input ? true : 'Missing application access key';
		}
	}
];

/**
 * Prints devices by their devID and finds number of devices.
 * @param {*} devices
 */
function printDevices(devices) {
	let numberOfDevices = 0;

	console.log(figures.tick, 'Devices:');
	console.group();

	devices.forEach((device) => {
		console.log(figures.line, `${device.devId}`);
		numberOfDevices++;
	});

	console.groupEnd();
	return numberOfDevices;
}

/**
 * Calls TTN devices api and handles ui.
 * @param {Object} param0 a config object
 */
async function devicesCommand({ ttn, logger = console }) {
	let { appID, appAccessKey } = ttn || {};

	if (!appID || !appAccessKey) {
		const answers = await prompt(questions);
		appID = answers.appID;
		appAccessKey = answers.appAccessKey;
	}

	const spinner = ora('Fetching devices...').start();
	try {
		const result = await devices({ appID, appAccessKey, logger });
		spinner.succeed('Successfully fetched devices');
		printDevices(result);
	} catch (error) {
		spinner.fail('Failed fetching...');
		logger.error(error);
		console.error(error);
	}
}

module.exports = { devices: devicesCommand, printDevices };
