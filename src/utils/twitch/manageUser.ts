import { Userstate } from 'tmi.js';
import { services } from '../../app.js';
import { UserInterface, UserTwitchInterface } from '../../interfaces/user.js';
import { getTwitchInfoFromUsername } from '../../services/platforms/twitch/api/kraken.js';
import { deepCompare } from '../miscellaneous/deepCompare.js';
import { getSubCount, getSubTier, isBroadcaster, isVIP } from './parseUserstate.js';

export async function manageUser(userstate: Userstate): Promise<void> {
	let info = await getTwitchInfoFromUsername(userstate.username);
	if (info === null || userstate['user-id'] === undefined) {
		return;
	}

	let twitch: UserTwitchInterface = {
		name: userstate.username.toString(),
		displayName: userstate['display-name'] || '',
		id: userstate['user-id'] || '',
		broadcaster: isBroadcaster(userstate),
		mod: userstate.mod || false,
		vip: isVIP(userstate),
		sub: userstate.subscriber || false,
		subCount: getSubCount(userstate),
		subTier: getSubTier(userstate),
		color: userstate.color,
		createdAt: info.createdAt.toString(),
		logo: info.logo.toString(),
		banned: false,
		timeouted: false,
		timeoutTime: Date.now()
	};

	let user = await services.db.users.getUserByTwitchID(userstate['user-id']);
	if (user !== null) {
		await setTwitch(user, twitch);
	} else {
		await services.db.users.addUser(twitch, null);
	}
}

const setTwitch = async (user: UserInterface, twitch: UserTwitchInterface): Promise<void> => {
	let updated = false;
	if (user.twitch !== undefined) {
		if (!deepCompare(user.twitch, twitch)) {
			user.twitch = twitch;
			updated = true;
		}
	} else {
		user.twitch = twitch;
		updated = true;
	}
	if (updated) {
		await services.db.users.updateUser(user);
	}
};
