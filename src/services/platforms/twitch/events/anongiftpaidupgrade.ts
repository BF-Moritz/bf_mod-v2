import { services } from '../../../../app';
import tmi from 'tmi.js';

export default {
	run: async (channel: string, username: string, userstate: tmi.Userstate) => {
		if (!services.initialized) {
			return;
		}

		services.bot.eventsHandler.channel?.send({
			event: 'anongiftpaidupgrade',
			group: 'sub',
			channel,
			username,
			userstate
		});
	},
	clients: ['bf_mod']
};
