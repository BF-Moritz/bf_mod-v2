import { services } from '../../../../app.js';
import { TwitchActionDeleteMessageInterface } from '../../../../interfaces/twitch/actions.js';

export default {
	run: async (params: TwitchActionDeleteMessageInterface) => {
		if (params.id) {
			const message = await services.db.twitchMessages.getMessageByID(params.id);
			let res;
			for (let channel of services.streamer.channels) {
				try {
					res = await services.streamer.client.deletemessage(channel, message.message.id);
				} catch (err) {
					res = { error: err };
				}
			}
			if (res && !(typeof res === 'object' && res.hasOwnProperty('error'))) {
				await services.db.twitchMessages.deleteMessage(message.index);
			}

			return true;
		}
		return null;
	}
};
