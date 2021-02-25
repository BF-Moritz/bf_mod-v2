import { ChatUserstate } from 'tmi.js';
import { services } from '../../../../app.js';

export default {
	run: async (from: string, userstate: ChatUserstate, message: string, self: boolean) => {
		if (!services.initialized) {
			return;
		}

		services.bot.eventsHandler.channel?.send({
			event: 'whisper',
			group: 'pm',
			from,
			userstate,
			message,
			self
		});
	},
	clients: ['bf_mod']
};
