import { services } from '../../../../app';

export default {
	run: async (channel: string, enabled: boolean, length: number) => {
		services.logger.debug('slowmode', channel, enabled, length);
	},
	clients: ['bf_mod']
};
