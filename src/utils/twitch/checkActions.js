import { getTwitchActions } from '../../config/twitch/twitchConfig.js';

export async function checkActions(eventName, eventModule) {
	if (!eventModule.default.hasOwnProperty('run')) {
		throw new Error(`${eventName} has no property 'run'!`);
	}

	if (typeof eventModule.default.run !== 'function') {
		throw new Error(`${eventName}.run is no function!`);
	}

	if (!(await checkActionsConfig(eventName))) {
		throw new Error(`config for ${eventName} is not correct!`);
	}

	return true;
}

async function checkActionsConfig(eventName) {
	const config = await getTwitchActions();
	const eventConfig = config[eventName];
	if (!eventConfig) {
		throw new Error(`${eventName} has no config!`);
	}

	return true;
}
