import { services } from '../../../../app';

export default {
	run: async (channel: string, mods: string[]) => {
		if (!services.initialized) {
			return;
		}

		services.bot.eventsHandler.channel?.send({
			event: 'mods',
			group: 'channel',
			channel,
			mods
		});
	},
	clients: ['bf_mod']
};
