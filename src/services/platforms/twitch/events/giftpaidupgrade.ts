import { services } from '../../../../app';
import * as tmi from 'tmi.js';

export default {
	run: async (channel: string, username: string, sender: string, userstate: tmi.SubGiftUpgradeUserstate) => {
		services.logger.debug('giftpainupgrade', channel, username, sender, userstate);
	},
	clients: ['bf_mod']
};
