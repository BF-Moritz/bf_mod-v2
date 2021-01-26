import { PrimeUpgradeUserstate, SubMethods } from 'tmi.js';
import { services } from '../../../../app';

export default {
	run: async (channel: string, username: string, methods: SubMethods, userstate: PrimeUpgradeUserstate) => {
		services.logger.debug('primepaidupgrade', channel, username, methods, userstate);
	},
	clients: ['bf_mod']
};
