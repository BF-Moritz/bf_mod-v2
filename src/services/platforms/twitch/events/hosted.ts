import { services } from '../../../../app';

export default {
	run: async (channel: string, username: string, viewers: number, autohost: boolean) => {
		if (!services.initialized) {
			return;
		}

		services.bot.eventsHandler.channel?.send({
			event: 'hosted',
			group: 'host',
			channel,
			username,
			viewers,
			autohost
		});
	},
	clients: ['bf_mod']
};
