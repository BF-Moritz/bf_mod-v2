import { services } from '../../../../app';

export default {
	run: async (channel: string, username: string, reason: string) => {
		services.logger.debug('ban', channel, username, reason);
	},
	clients: ['bf_mod']
};
