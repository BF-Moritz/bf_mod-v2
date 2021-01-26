import { DeleteUserstate } from 'tmi.js';
import { services } from '../../../../app';

export default {
	run: async (channel: string, username: string, deletedMessage: string, userstate: DeleteUserstate) => {
		services.logger.debug('messagedeleted', channel, username, deletedMessage, userstate);
	},
	clients: ['bf_mod']
};
