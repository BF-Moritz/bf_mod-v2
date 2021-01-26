import { services } from '../../../../app.js';
import { TwitchActionUnbanInterface } from '../../../../interfaces/twitch/actions.js';

export default {
	run: async (params: TwitchActionUnbanInterface) => {
		if (params.id) {
			const user = await services.db.users.getUserByTwitchID(params.id);
			if (user === undefined || user === null) return;
			let res;
			for (let channel of services.streamer.channels) {
				try {
					res = await services.streamer.client.unban(channel, user.twitch?.name || '');
				} catch (err) {
					res = { error: err };
				}
			}
			if (res && !(typeof res === 'object' && res.hasOwnProperty('error'))) {
				if (!user.twitch) return res;
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
