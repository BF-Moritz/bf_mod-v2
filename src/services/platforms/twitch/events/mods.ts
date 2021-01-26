import { services } from '../../../../app';

export default {
	run: async (channel: string, mods: string[]) => {
		services.logger.debug('mods', channel, mods);
	},
	clients: ['bf_mod']
};
