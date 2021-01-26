import { services } from '../../../../app';

export default {
	run: async (channel: string, enabled: boolean) => {
		services.logger.debug('emoteonly', channel, enabled);
	},
	clients: ['bf_mod']
};
