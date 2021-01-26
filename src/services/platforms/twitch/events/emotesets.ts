import { EmoteObj } from 'tmi.js';
import { services } from '../../../../app';

export default {
	run: async (sets: string, obj: EmoteObj) => {
		services.logger.debug('emotesets:', sets, obj);
	},
	clients: ['bf_mod']
};
