import { services } from '../../../../app';

export default {
	run: async (channel: string, vips: string[]) => {
		if (!services.initialized) {
			return;
		}

		services.bot.eventsHandler.channel?.send({
			event: 'vips',
			group: 'channel',
			channel,
			vips
		});
	},
	clients: ['bf_mod']
};
