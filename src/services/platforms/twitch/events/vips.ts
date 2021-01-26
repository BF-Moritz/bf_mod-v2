import { services } from '../../../../app';

export default {
	run: async (channel: string, vips: string[]) => {
		services.logger.debug('vips', channel, vips);
	},
	clients: ['bf_mod']
};
