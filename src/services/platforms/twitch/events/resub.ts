import { SubMethods, SubUserstate } from 'tmi.js';
import { services } from '../../../../app';

export default {
	run: async (
		channel: string,
		username: string,
		months: number,
		message: string,
		userstate: SubUserstate,
		methods: SubMethods
	) => {
		if (!services.initialized) {
			return;
		}

		services.bot.eventsHandler.channel?.send({
			event: 'resub',
			group: 'sub',
			channel,
			username,
			months,
			message,
			userstate,
			methods
		});
	},
	clients: ['bf_mod']
};
