import { ChatUserstate } from 'tmi.js';
import { services } from '../../../../app';

export default {
	run: async (
		channel: string,
		username: string,
		rewardType: 'highlighted-message' | 'skip-subs-mode-message' | string,
		tags: ChatUserstate
	) => {
		if (!services.initialized) {
			return;
		}

		services.bot.eventsHandler.channel?.send({
			event: 'redeem',
			group: 'points',
			channel,
			username,
			rewardType,
			tags
		});
	},
	clients: ['bf_mod']
};
