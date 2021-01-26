import { services } from '../../../../app.js';
import { TwitchActionTimeoutInterface } from '../../../../interfaces/twitch/actions.js';

export default {
	run: async (params: TwitchActionTimeoutInterface) => {
		const time = params.time || 600;
		const reason = params.reason || '';
		if (params.id) {
			const user = await services.db.users.getUserByTwitchID(params.id);
			if (user === undefined || user === null) return;
			let res;
			for (let channel of services.streamer.channels) {
				try {
					res = await services.streamer.client.timeout(channel, user.twitch?.name || '', time, reason);
				} catch (err) {
					res = { error: err };
				}
			}
			if (res && !(typeof res === 'object' && res.hasOwnProperty('error'))) {
				if (!user.twitch) return res;
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
