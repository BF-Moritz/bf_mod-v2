import { getTwitchEvents } from '../../config/twitch/twitchConfig';
import { TwitchEventsModuleInterface } from '../../interfaces/twitch/events';

export async function checkEvents(eventName: string, eventModule: TwitchEventsModuleInterface) {
	if (!eventModule.default) {
		throw new Error(`${eventName} was not implemented yet`);
	}
	if (!eventModule.default.hasOwnProperty('run')) {
		throw new Error(`${eventName} has no property 'run'!`);
	}

	if (!eventModule.default.hasOwnProperty('clients')) {
		throw new Error(`${eventName} has no property 'clients'!`);
	}

	if (typeof eventModule.default.run !== 'function') {
		throw new Error(`${eventName}.run is no function!`);
	}

	if (typeof eventModule.default.clients !== 'object') {
		throw new Error(`${eventName}.clients is no objects!`);
	}

	if (!(await checkEventConfig(eventName))) {
		throw new Error(`config for ${eventName} is not correct!`);
	}

	return true;
}

async function checkEventConfig(eventName: string) {
	const config = await getTwitchEvents();
	const eventConfig = config[eventName];
	if (!eventConfig) {
		throw new Error(`${eventName} has no config!`);
	}
	if (!eventConfig.hasOwnProperty('enabled')) {
		throw new Error(`${eventName} has no enabled config!`);
	}

	return true;
}
