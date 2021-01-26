import { services } from '../../../../app';

export default {
	run: async (address: string, port: number) => {
		services.logger.debug('connected', address, port);
	},
	clients: ['bf_mod']
};
