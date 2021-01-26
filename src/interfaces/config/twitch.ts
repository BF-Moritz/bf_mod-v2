export interface TwitchActionsInterface {
	[key: string]: TwitchSingleActionInterface;
}

export interface TwitchSingleActionInterface {
	enabled: boolean;
}

export interface TwitchCommandsInterface {
	[key: string]: TwitchSingleCommandInterface;
}

export interface TwitchSingleCommandInterface {
	enabled: boolean;
	channels: string[];
	permission: string;
	cooldown: number;
	private: boolean;
	allowedUsers: string[];
}

export interface TwitchEventsInterface {
	[key: string]: TwitchSingleEventInterface;
}

export interface TwitchSingleEventInterface {
	enabled: boolean;
}

export interface TwitchGeneralInterface {
	activated: boolean;
	commandPrefix: string;
}
