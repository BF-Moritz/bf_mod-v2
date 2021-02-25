import { MsgID } from 'tmi.js';
import { services } from '../../../../app';

export default {
	run: async (channel: string, msgID: MsgID, message: string) => {
		if (!services.initialized) {
			return;
		}

		services.bot.eventsHandler.channel?.send({
			event: 'notice',
			group: 'channel',
			channel,
			msgID,
			message
		});
	},
	clients: ['bf_mod']
};
