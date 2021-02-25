import { services } from '../../../../app';

export default {
	run: async (channel: string, enabled: boolean, length: number) => {
		if (!services.initialized) {
			return;
		}

		services.bot.eventsHandler.channel?.send({
			event: 'slowmode',
			group: 'chat',
			channel,
			enabled,
			length
		});
	},
	clients: ['bf_mod']
};
