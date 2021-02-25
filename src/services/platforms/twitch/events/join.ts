import { services } from '../../../../app';

export default {
	run: async (channel: string, username: string, self: boolean) => {
		if (!services.initialized) {
			return;
		}

		services.bot.eventsHandler.channel?.send({
			event: 'join',
			group: 'channel',
			channel,
			username
		});

		const id = username;
		await services.addTwitchViewer(id);
	},
	clients: ['bf_mod']
};
