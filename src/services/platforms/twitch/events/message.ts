import { ChatUserstate } from 'tmi.js';
import { services } from '../../../../app';

export default {
	run: async (channel: string, userstate: ChatUserstate, message: string, self: boolean) => {
		// DEPRECATED
		if (!services.initialized) {
			return;
		}

		services.bot.eventsHandler.channel?.send({
			event: 'message',
			group: 'message',
			channel,
			userstate,
			message,
			self
		});
	},
	clients: ['bf_mod', 'bf_moritz']
};
