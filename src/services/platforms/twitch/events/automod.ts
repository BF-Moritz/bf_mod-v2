import { services } from '../../../../app';
import tmi from 'tmi.js';

export default {
	run: async (channel: string, msgID: 'msg_rejected' | 'msg_rejected_mandatory', message: string) => {
		if (!services.initialized) {
			return;
		}

		services.bot.eventsHandler.channel?.send({
			event: 'automod',
			group: 'mod',
			channel,
			msgID,
			message
		});
	},
	clients: ['bf_mod']
};
