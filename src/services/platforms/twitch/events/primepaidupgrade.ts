import { PrimeUpgradeUserstate, SubMethods } from 'tmi.js';
import { services } from '../../../../app';

export default {
	run: async (channel: string, username: string, methods: SubMethods, userstate: PrimeUpgradeUserstate) => {
		if (!services.initialized) {
			return;
		}

		services.bot.eventsHandler.channel?.send({
			event: 'primepaidupgrade',
			group: 'sub',
			channel,
			username,
			methods,
			userstate
		});
	},
	clients: ['bf_mod']
};
