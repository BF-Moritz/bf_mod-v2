import { services } from '../../../../app';

export default {
	run: async () => {
		services.logger.debug('logon');
	},
	clients: ['bf_mod']
};
