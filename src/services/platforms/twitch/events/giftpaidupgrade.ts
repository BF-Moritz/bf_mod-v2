import { services } from '../../../../app';
import * as tmi from 'tmi.js';

export default {
	run: async (channel: string, username: string, sender: string, userstate: tmi.SubGiftUpgradeUserstate) => {
		if (!services.initialized) {
			return;
		}

		services.bot.eventsHandler.channel?.send({
			event: 'giftpaidupgrade',
			group: 'sub',
			channel,
			username,
			sender,
			userstate
		});
	},
	clients: ['bf_mod']
};
