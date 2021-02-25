import { RoomState } from 'tmi.js';
import { services } from '../../../../app';

export default {
	run: async (channel: string, state: RoomState) => {
		if (!services.initialized) {
			return;
		}

		services.bot.eventsHandler.channel?.send({
			event: 'roomstate',
			group: 'channel',
			channel,
			state
		});
		services.bot.state = { ...state };
	},
	clients: ['bf_mod']
};
