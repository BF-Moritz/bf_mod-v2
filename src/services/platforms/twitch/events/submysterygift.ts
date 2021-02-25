import { SubMethods, SubMysteryGiftUserstate } from 'tmi.js';
import { services } from '../../../../app';

export default {
	run: async (
		channel: string,
		username: string,
		numbOfSubs: number,
		methods: SubMethods,
		userstate: SubMysteryGiftUserstate
	) => {
		if (!services.initialized) {
			return;
		}

		services.bot.eventsHandler.channel?.send({
			event: 'submysterygift',
			group: 'sub',
			channel,
			username,
			numbOfSubs,
			methods,
			userstate
		});
	},
	clients: ['bf_mod']
};
