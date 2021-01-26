import { services } from '../../../../app';

export default {
	run: async (address: string, port: number) => {
		services.logger.debug('connecting', address, port);
	},
	clients: ['bf_mod']
};
