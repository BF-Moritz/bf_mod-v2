export interface TwitchActionBanInterface {
	reason?: string;
	id?: string;
	name?: string;
}

export interface TwitchActionDeleteMessageInterface {
	id?: string;
	name?: string;
}

export interface TwitchActionModInterface {
	id?: string;
	name?: string;
}

export interface TwitchActionTimeoutInterface {
	id?: string;
	name?: string;
	time?: number;
	reason?: string;
}

export interface TwitchActionUnbanInterface {
	id?: string;
	name?: string;
}

export interface TwitchActionUnmodInterface {
	id?: string;
	name?: string;
}

export interface TwitchActionUnvipInterface {
	id?: string;
	name?: string;
}

export interface TwitchActionVipInterface {
	id?: string;
	name?: string;
}

export interface TwitchActionsModuleInterface {
	default: TwitchActionsModuleDefaultInterface;
}

export interface TwitchActionsModuleDefaultInterface {
	run: Function;
}
