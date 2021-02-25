import { services } from '../../../../app';

export default {
	run: async (latency: number) => {
		if (!services.initialized) {
			return;
		}

		services.bot.eventsHandler.channel?.send({
			event: 'pong',
			group: 'connection',
			latency
		});
	},
	clients: ['bf_mod']
};
