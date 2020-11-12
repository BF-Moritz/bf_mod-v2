import { getTwitchCommands } from '../../config/twitch/twitchConfig.js';

export async function checkCommands(eventName, eventModule) {
	if (!eventModule.default.hasOwnProperty('run')) {
		throw new Error(`${eventName} has no property 'run'!`);
	}

	if (!eventModule.default.hasOwnProperty('aliases')) {
		throw new Error(`${eventName} has no property 'aliases'!`);
	}

	if (!eventModule.default.hasOwnProperty('description')) {
		throw new Error(`${eventName} has no property 'description'!`);
	}

	if (!eventModule.default.hasOwnProperty('clients')) {
		throw new Error(`${eventName} has no property 'clients'!`);
	}

	if (typeof eventModule.default.run !== 'function') {
		throw new Error(`${eventName}.run is no function!`);
	}

	if (typeof eventModule.default.aliases !== 'object') {
		throw new Error(`${eventName}.clients is no aliases!`);
	}

	if (typeof eventModule.default.description !== 'string') {
		throw new Error(`${eventName}.clients is no description!`);
	}

	if (typeof eventModule.default.clients !== 'object') {
		throw new Error(`${eventName}.clients is no objects!`);
	}

	if (!(await checkCommandsConfig(eventName))) {
		throw new Error(`config for ${eventName} is not correct!`);
	}

	return true;
}

async function checkCommandsConfig(eventName) {
	const config = await getTwitchCommands();
	const eventConfig = config[eventName];
	if (!eventConfig) {
		throw new Error(`${eventName} has no config!`);
	}
	if (!eventConfig.hasOwnProperty('enabled')) {
		throw new Error(`${eventName} has no enabled config!`);
	}

	return true;
}
