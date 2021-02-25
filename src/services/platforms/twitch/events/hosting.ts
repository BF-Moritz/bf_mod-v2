import { services } from '../../../../app';

export default {
	run: async (channel: string, username: string, viewers: number) => {
		if (!services.initialized) {
			return;
		}

		services.bot.eventsHandler.channel?.send({
			event: 'hosting',
			group: 'host',
			channel,
			username,
			viewers
		});
	},
	clients: ['bf_mod']
};
