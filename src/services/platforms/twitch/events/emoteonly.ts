import { services } from '../../../../app';

export default {
	run: async (channel: string, enabled: boolean) => {
		if (!services.initialized) {
			return;
		}

		services.bot.eventsHandler.channel?.send({
			event: 'emoteonly',
			group: 'chat',
			channel,
			enabled
		});
	},
	clients: ['bf_mod']
};
