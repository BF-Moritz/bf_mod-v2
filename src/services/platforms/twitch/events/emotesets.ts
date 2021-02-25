import { EmoteObj } from 'tmi.js';
import { services } from '../../../../app';

export default {
	run: async (sets: string, obj: EmoteObj) => {
		if (!services.initialized) {
			return;
		}

		services.bot.eventsHandler.channel?.send({
			event: 'emotesets',
			group: 'chat',
			sets,
			obj
		});
	},
	clients: ['bf_mod']
};
