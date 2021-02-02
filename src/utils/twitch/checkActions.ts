import { services } from '../../app';
import { getTwitchActions } from '../../config/twitch/twitchConfig';
import { TwitchActionsModuleInterface } from '../../interfaces/twitch/actions';

export async function checkActions(eventName: string, eventModule: TwitchActionsModuleInterface) {
	if (!eventModule.default) {
		throw new Error(`${eventName} was not implemented yet`);
	}

	if (!eventModule.default.hasOwnProperty('run')) {
		services.logger.error(`${eventName} was not implemented yet`);
		return false;
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

async function checkActionsConfig(eventName: string) {
	const config = await getTwitchActions();
	const eventConfig = config[eventName];
	if (!eventConfig) {
		throw new Error(`${eventName} has no config!`);
	}

	return true;
}
