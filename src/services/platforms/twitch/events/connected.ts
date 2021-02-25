import { services } from '../../../../app';

export default {
	run: async (address: string, port: number) => {
		if (!services.initialized) {
			return;
		}

		services.bot.eventsHandler.channel?.send({
			event: 'connected',
			group: 'connection',
			address,
			port
		});
	},
	clients: ['bf_mod']
};
