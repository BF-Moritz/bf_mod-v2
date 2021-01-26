import { services } from '../../../../app';

export default {
	run: async (channel: string) => {
		services.logger.debug('serverchange', channel);
	},
	clients: ['bf_mod']
};
