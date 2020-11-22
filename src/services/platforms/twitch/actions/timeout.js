import { services } from '../../../../app.js';

export default {
	run: async (params) => {
		const time = params.time || 600;
		const reason = params.reason || '';
		if (params.id) {
			const user = await services.db.users.getUserByTwitchID(params.id);
			let res;
			for (let channel of services.streamer.channels) {
				try {
					res = await services.streamer.client.timeout(channel, user.twitch.name, time, reason);
				} catch (err) {
					res = { error: err };
				}
			}
			if (!res.error) {
				user.twitch.timeouted = true;
				user.twitch.timeoutTime = Date.now() + 1000 * time;
				await services.db.users.updateUser(user);
			}

			return res;
		} else if (params.name) {
			// TODO name
		}
		return null;
	}
};
