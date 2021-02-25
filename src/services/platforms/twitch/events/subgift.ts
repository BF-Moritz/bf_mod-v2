import { SubGiftUserstate, SubMethods } from 'tmi.js';
import { services } from '../../../../app';

export default {
	run: async (
		channel: string,
		username: string,
		streakMonths: number,
		recipient: string,
		methods: SubMethods,
		userstate: SubGiftUserstate
	) => {
		if (!services.initialized) {
			return;
		}

		services.bot.eventsHandler.channel?.send({
			event: 'subgift',
			group: 'sub',
			channel,
			username,
			streakMonths,
			recipient,
			methods,
			userstate
		});
	},
	clients: ['bf_mod']
};
