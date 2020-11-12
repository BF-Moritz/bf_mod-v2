import {services} from '../../app.js';
import {getTwitchInfoFromUsername} from '../../services/platforms/twitch/api/kraken.js';
import {getSubCount, getSubTier, isBroadcaster, isVIP} from './parseUserstate.js';

export async function manageUser(userstate) {
	
	let info = await getTwitchInfoFromUsername(userstate.username);
	if (info === null) {
		return;
	}
	
	let twitch = {
		name: userstate.username.toString(),
		displayName: userstate['display-name'].toString(),
		id: userstate['user-id'].toString(),
		broadcaster: isBroadcaster(userstate),
		mod: userstate.mod,
		vip: isVIP(userstate),
		sub: userstate.subscriber,
		subCount: getSubCount(userstate),
		subTier: getSubTier(userstate),
		color: userstate.color.toString(),
		createdAt: info.createdAt.toString(),
		logo: info.logo.toString()
	};
	let user = await services.db.users.getUserByTwitchID(userstate['user-id']);
	if (user !== null) {
		await checkUserData(userstate['user-id'], twitch);
	} else {
		await services.db.users.addUser(twitch, null);
	}
}

const checkUserData = async (twitchID, twitch) => {
	let currentUserData = await services.db.users.getUserByTwitchID(twitchID);
	let updated = false;
	if (currentUserData.twitch !== null) {
		for (let property in twitch) {
			if (twitch.hasOwnProperty(property)) {
				if (currentUserData.twitch[property] !== twitch[property]) {
					currentUserData.twitch[property] = twitch[property];
					updated = true;
				}
			}
		}
	} else {
		currentUserData.twitch = twitch;
		updated = true;
	}
	if (updated) {
		let user = await services.db.users.updateUser(currentUserData);
		console.log(user);
	}
};