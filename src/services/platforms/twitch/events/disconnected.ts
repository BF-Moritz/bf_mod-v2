import { services } from '../../../../app';

export default {
	run: async (reason: string) => {
		services.logger.debug('disconnected', reason);
	},
	clients: ['bf_mod']
};
