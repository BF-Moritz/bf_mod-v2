import { services } from '../../../../app';
import tmi from 'tmi.js';

export default {
	run: async (channel: string, msgID: 'msg_rejected' | 'msg_rejected_mandatory', message: string) => {
		services.logger.debug('automod:', channel, msgID, message);
	},
	clients: ['bf_mod']
};
