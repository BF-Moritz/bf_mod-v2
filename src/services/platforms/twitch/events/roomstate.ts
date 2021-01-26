import { RoomState } from 'tmi.js';
import { services } from '../../../../app';

export default {
	run: async (channel: string, state: RoomState) => {
		services.logger.debug('roomstate', channel, state);
		services.bot.state = { ...state };
	},
	clients: ['bf_mod']
};
