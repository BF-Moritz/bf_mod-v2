import { services } from '../../../../app.js';

export default {
	run: async (params) => {
		if (params.id) {
			const message = await services.db.twitch_messages.getMessageByID(params.id);
			let res;
			for (let channel of services.streamer.channels) {
				try {
					res = await services.streamer.client.deletemessage(channel, message.message.id);
				} catch (err) {
					res = { error: err };
				}
			}
			if (!res.error) {
				await services.db.twitch_messages.deleteMessage(message.index);
			}

			return true;
		}
		return null;
	}
};
