import { services } from '../../../../app';

export default {
	run: async (channel: string, viewers: number) => {
		if (!services.initialized) {
			return;
		}

		services.bot.eventsHandler.channel?.send({
			event: 'unhost',
			group: 'host',
			channel,
			viewers
		});
	},
	clients: ['bf_mod']
};
