import { services } from '../../../../app';

export default {
	run: async () => {
		services.logger.debug('reconnect');
	},
	clients: ['bf_mod']
};
