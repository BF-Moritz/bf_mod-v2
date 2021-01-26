import { services } from '../../../../app.js';
import { TwitchActionModInterface } from '../../../../interfaces/twitch/actions.js';

export default {
	run: async (params: TwitchActionModInterface) => {
		if (params.id) {
			const user = await services.db.users.getUserByTwitchID(params.id);
			if (user === undefined || user == null) return;
			let res;
			for (let channel of services.streamer.channels) {
				try {
					res = await services.streamer.client.mod(channel, user.twitch?.name || '');
				} catch (err) {
					res = { error: err };
				}
			}
			if (res && !(typeof res === 'object' && res.hasOwnProperty('error'))) {
				if (!user.twitch) return res;
				user.twitch.mod = true;
				user.twitch.vip = false;
				await services.db.users.updateUser(user);
			}

			return res;
		}
		return null;
	}
};
