import { services } from '../../../../app.js';

export default {
	run: async (params) => {
		if (params.id) {
			const user = await services.db.users.getUserByTwitchID(params.id);
			let res;
			for (let channel of services.streamer.channels) {
				try {
					res = await services.streamer.client.unban(channel, user.twitch.name);
				} catch (err) {
					res = { error: err };
				}
			}
			if (!res.error) {
				user.twitch.banned = false;
				user.twitch.timeouted = false;
				await services.db.users.updateUser(user);
			}

			return res;
		} else if (params.name) {
			// TODO name
		}
		return null;
	}
};
