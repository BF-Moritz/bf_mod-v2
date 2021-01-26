import { services } from '../../../../app';
import { TwitchActionBanInterface } from '../../../../interfaces/twitch/actions';

export default {
	run: async (params: TwitchActionBanInterface) => {
		const reason = params.reason || '';
		if (params.id) {
			const user = await services.db.users.getUserByTwitchID(params.id);
			if (user === undefined || user === null) return;
			let res;
			for (let channel of services.streamer.channels) {
				try {
					res = await services.streamer.client.ban(channel, user.twitch?.name || '', reason);
				} catch (err) {
					res = { error: err };
				}
			}
			if (res && !(typeof res === 'object' && res.hasOwnProperty('error'))) {
				if (!user.twitch) return res;
				user.twitch.banned = true;
				await services.db.users.updateUser(user);
			}

			return res;
		} else if (params.name) {
			// TODO name
		}
		return null;
	}
};
