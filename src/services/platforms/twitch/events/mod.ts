import { services } from '../../../../app';

export default {
	run: async (channel: string, username: string) => {
		services.logger.debug('mod', channel, username);
	},
	clients: ['bf_mod']
};
