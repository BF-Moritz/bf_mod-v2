import { services } from '../../../../app';

export default {
	run: async (channel: string, enabled: boolean) => {
		services.logger.debug('subscribers', channel, enabled);
	},
	clients: ['bf_mod']
};
