import { services } from '../../../../app';

export default {
	run: async () => {
		services.logger.debug('ping');
	},
	clients: ['bf_mod']
};
