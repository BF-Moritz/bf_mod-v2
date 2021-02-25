import { services } from '../../../../app';

export default {
	run: async (channel: string) => {
		if (!services.initialized) {
			return;
		}

		services.bot.eventsHandler.channel?.send({
			event: 'clearchat',
			group: 'chat',
			channel
		});
	},
	clients: ['bf_mod']
};
