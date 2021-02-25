import { services } from '../../../../app';

export default {
	run: async (reason: string) => {
		if (!services.initialized) {
			return;
		}

		services.bot.eventsHandler.channel?.send({
			event: 'disconnected',
			group: 'connection',
			reason
		});
	},
	clients: ['bf_mod']
};
