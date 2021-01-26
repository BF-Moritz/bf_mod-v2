import { services } from '../../../../app';

export default {
	run: async (channel: string, viewers: number) => {
		services.logger.debug('unhost', channel, viewers);
	},
	clients: ['bf_mod']
};
