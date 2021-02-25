import { services } from '../../../../app';

export default {
	run: async (channel: string, username: string, reason: string, duration: number) => {
		if (!services.initialized) {
			return;
		}

		services.bot.eventsHandler.channel?.send({
			event: 'timeout',
			group: 'mod',
			channel,
			username,
			reason,
			duration
		});
	},
	clients: ['bf_mod']
};
