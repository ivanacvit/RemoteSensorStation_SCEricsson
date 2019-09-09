#!/usr/bin/env node
const config = require('./config');
const program = require('commander');
const { send, devices, read, importFile, sync } = require('./commands');
const debug = require('debug')('ttn:cli');

program.name('ttn-cli');

program.command('devices').description('List the devices of the application').action(() => devices(config));

program
	.command('send')
	.description('Send a downlink message to one or more devices with the specified device ID.')
	.action(() => send(config));

program.command('read').description('Read a specific parameter.').action(() => read(config));

program
	.command('import')
	.description('Send a downlink message with the specified device ID from a file.')
	.action(() => importFile(config));

program.command('sync').description('Synchronize devices.').action(() => sync(config));

//  Handle unsupported options
if (process.argv.length < 3) {
	program.help();
	process.exit(1);
}

// Error on unknown commands
program.on('command:*', function() {
	console.error('Invalid command: %s\nSee --help for a list of available commands.', program.args.join(' '));
	process.exit(1);
});

//  Allow commander to parse args
program.parse(process.argv);
