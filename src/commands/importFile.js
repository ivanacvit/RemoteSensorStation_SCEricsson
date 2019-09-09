const { send } = require('../ttn-api');
const ora = require('ora');
const debug = require('debug')('ttn:importFile');
const parameters = require('../config/parameters.js');
const yaml = require('js-yaml');
const fs = require('fs');
const { prompt } = require('inquirer');
const path = require('path');

const questions = [
	{
		type: 'input',
		name: 'path_to_template_file',
		message: 'Config file (.yml):',
		default: path.join(__dirname, '..', process.env.CONFIG_DIR, process.env.YAML_TEMPLATE)
	}
];

/**
 * Reads parameters from file
 */

async function importFileCommand({ ttn, logger = console }) {
	let { appID, appAccessKey } = ttn || {};
	const answers = await prompt(questions);
	const { path_to_template_file } = answers;

	console.log(__dirname);
	console.log(path_to_template_file, path.resolve(path_to_template_file));

	const config = yaml.safeLoad(
		// fs.readFileSync('C:\\Users\\student\\Desktop\\ttn-cli\\src\\config\\parameter-file.yml', 'utf8')
		fs.readFileSync(path.resolve(path_to_template_file))
	);

	const spinner = ora('Importing...').start();
	try {
		/**
 		 * Format messages (parameters) before sending them from a file
		 */
		const keys = Object.keys(config);

		keys.forEach(function(key) {
			lista_params = config[key];
			let buffer = Buffer.alloc(0);

			lista_params.forEach(function(param) {
				const id = param['paramID'];
				const value = param['paramValue'];
				const size = parameters[id]['size'];

				const params = Buffer.alloc(1 + size);
				params[0] = id;
				params.writeIntLE(value, 1, size);

				buffer = Buffer.concat([ buffer, params ]);
			});

			console.log('\n', buffer);

			send({ appID, appAccessKey, buffer }, key);
		});
		spinner.succeed('Successfully imported file');
	} catch (error) {
		spinner.fail('Failed importing...');
		logger.error(error);
		console.error(error);
	}
}

module.exports = { importFile: importFileCommand };
