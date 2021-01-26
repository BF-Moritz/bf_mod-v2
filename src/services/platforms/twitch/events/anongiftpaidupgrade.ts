import { services } from '../../../../app';
import tmi from 'tmi.js';

export default {
	run: async (channel: string, username: string, userstate: tmi.Userstate) => {
		services.logger.debug('anongiftpaidupgrade', channel, username, userstate);
	},
	clients: ['bf_mod']
};
