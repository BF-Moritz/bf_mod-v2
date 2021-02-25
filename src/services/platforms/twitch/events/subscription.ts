import { SubMethods, SubUserstate } from 'tmi.js';
import { services } from '../../../../app';

export default {
	run: async (channel: string, username: string, method: SubMethods, message: string, userstate: SubUserstate) => {
		if (!services.initialized) {
			return;
		}

		services.bot.eventsHandler.channel?.send({
			event: 'subscription',
			group: 'sub',
			channel,
			username,
			method,
			message,
			userstate
		});
	},
	clients: ['bf_mod']
};
