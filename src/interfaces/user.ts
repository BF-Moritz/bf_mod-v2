export interface UserInterface {
	_id?: string;
	twitch?: UserTwitchInterface;
	discord?: UserDiscordInterface;
	country?: UserCountryInterface;
	team?: string;
}

export interface UserTwitchInterface {
	name: string;
	displayName: string;
	id: string;
	broadcaster: boolean;
	mod: boolean;
	vip: boolean;
	sub: boolean;
	subCount: number;
	subTier: number;
	color?: string;
	createdAt: string;
	logo?: string;
	banned: boolean;
	timeouted: boolean;
	timeoutTime: number;
}

export interface UserDiscordInterface {}

export interface UserCountryInterface {}
