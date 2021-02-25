import { services } from '../../../../app';

export default {
	run: async (channel: string, username: string) => {
		if (!services.initialized) {
			return;
		}

		services.bot.eventsHandler.channel?.send({
			event: 'unmod',
			group: 'mod',
			channel,
			username
		});
	},
	clients: ['bf_mod']
};
