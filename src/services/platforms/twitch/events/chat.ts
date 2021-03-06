import { services } from '../../../../app';
import tmi from 'tmi.js';

export default {
	run: async (channel: string, userstate: tmi.Userstate, message: string, self: boolean): Promise<void> => {
		if (!services.initialized) {
			return;
		}

		services.bot.eventsHandler.channel?.send({
			event: 'chat',
			group: 'message',
			channel,
			userstate,
			message,
			self
		});
	},
	clients: ['bf_mod']
};
