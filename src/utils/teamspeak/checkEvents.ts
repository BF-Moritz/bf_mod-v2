// // import { getTeamspeakEvents } from '../../config/teamspeak/teamspeakConfig.js';

// export async function checkEvents(eventName: string, eventModule) {
// 	if (!eventModule.default.hasOwnProperty('run')) {
// 		throw new Error(`${eventName} has no property 'run'!`);
// 	}

// 	if (typeof eventModule.default.run !== 'function') {
// 		throw new Error(`${eventName}.run is no function!`);
// 	}

// 	// if (!(await checkEventConfig(eventName))) {
// 	// 	throw new Error(`config for ${eventName} is not correct!`);
// 	// }

// 	return true;
// }

// async function checkEventConfig(eventName) {
// 	const config = await getTwitchEvents();
// 	const eventConfig = config[eventName];
// 	if (!eventConfig) {
// 		throw new Error(`${eventName} has no config!`);
// 	}
// 	if (!eventConfig.hasOwnProperty('enabled')) {
// 		throw new Error(`${eventName} has no enabled config!`);
// 	}

// 	return true;
// }
