import { DeleteUserstate } from 'tmi.js';
import { services } from '../../../../app';

export default {
	run: async (channel: string, username: string, deletedMessage: string, userstate: DeleteUserstate) => {
		if (!services.initialized) {
			return;
		}

		services.bot.eventsHandler.channel?.send({
			event: 'messagedeleted',
			group: 'message',
			channel,
			username,
			deletedMessage,
			userstate
		});
	},
	clients: ['bf_mod']
};
