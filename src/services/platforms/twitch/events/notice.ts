import { MsgID } from 'tmi.js';
import { services } from '../../../../app';

export default {
	run: async (channel: string, msgID: MsgID, message: string) => {
		services.logger.debug('notice', channel, msgID, message);
	},
	clients: ['bf_mod']
};
