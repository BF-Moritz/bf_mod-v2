import { services } from '../../../../app';

export default {
	run: async (channel: string, username: string, reason: string, duration: number) => {
		services.logger.debug('timeout', channel, username, reason, duration);
	},
	clients: ['bf_mod']
};
