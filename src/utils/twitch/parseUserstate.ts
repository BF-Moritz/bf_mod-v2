import { Userstate } from 'tmi.js';
import { ParsedBadgesInterface } from '../../interfaces/message';

export function isBroadcaster(userstate: Userstate): boolean {
	return userstate.badges !== undefined && userstate.badges.broadcaster === '1';
}

export function isVIP(userstate: Userstate): boolean {
	return userstate.badges !== undefined && userstate.badges.vip === '1';
}

export function getSubCount(userstate: Userstate): number {
	if (
		userstate['badge-info'] !== undefined &&
		userstate['badge-info'] !== null &&
		userstate['badge-info'].subscriber
	) {
		return +userstate['badge-info'].subscriber;
	}
	return 0;
}

export function getSubTier(userstate: Userstate): number {
	if (userstate.badges !== undefined && userstate.badges.subscriber) {
		return Math.floor(+userstate.badges.subscriber / 1000);
	}
	return 0;
}

export function parseBadges(rawBadges: string): ParsedBadgesInterface[] {
	const badges: ParsedBadgesInterface[] = [];

	if (rawBadges !== null) {
		rawBadges.split(',').forEach((badge) => {
			const parts = badge.split('/');
			badges.push({ name: parts[0], version: parts[1] });
		});
	}

	return badges;
}
