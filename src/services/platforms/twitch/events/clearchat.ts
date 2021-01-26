import { services } from '../../../../app';

export default {
	run: async (channel: string) => {
		services.logger.debug('clearchat', channel);
	},
	clients: ['bf_mod']
};
