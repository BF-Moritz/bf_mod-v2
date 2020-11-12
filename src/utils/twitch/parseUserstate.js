export function isBroadcaster(userstate) {
	return (userstate.badges !== null && userstate.badges.broadcaster === '1');
}

export function isVIP(userstate) {
	return (userstate.badges !== null && userstate.badges.vip === '1');
}

export function getSubCount(userstate) {
	if (userstate['badge-info'] != null && userstate['badge-info'].subscriber) {
		return userstate['badge-info'].subscriber;
	}
	return 0;
}

export function getSubTier(userstate) {
	if (userstate.badges != null && userstate.badges.subscriber) {
		return Math.floor(userstate.badges.subscriber / 1000);
	}
	return 0;
}