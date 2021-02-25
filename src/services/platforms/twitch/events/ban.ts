import { services } from '../../../../app';

export default {
	run: async (channel: string, username: string, reason: string) => {
		if (!services.initialized) {
			return;
		}

		services.bot.eventsHandler.channel?.send({
			event: 'ban',
			group: 'mod',
			channel,
			username,
			reason
		});
	},
	clients: ['bf_mod']
};
