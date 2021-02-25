import { services } from '../../../../app';

export default {
	run: async () => {
		if (!services.initialized) {
			return;
		}

		services.bot.eventsHandler.channel?.send({
			event: 'logon',
			group: 'connection'
		});
	},
	clients: ['bf_mod']
};
