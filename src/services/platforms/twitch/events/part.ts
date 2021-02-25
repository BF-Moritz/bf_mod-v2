import { services } from '../../../../app';

export default {
	run: async (channel: string, username: string, self: boolean) => {
		if (!services.initialized) {
			return;
		}

		services.bot.eventsHandler.channel?.send({
			event: 'part',
			group: 'channel',
			channel,
			username,
			self
		});

		const id = username;
		await services.removeTwitchViewer(id);
	},
	clients: ['bf_mod']
};
