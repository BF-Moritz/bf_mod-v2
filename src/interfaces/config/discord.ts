export interface DiscordGeneralInterface {
	activated: boolean;
	twitchLog: boolean;
}

export interface DiscordChannelsInterface {
	logChannel: LogChannel;
}

export interface LogChannel {
	id: string;
}

export interface DiscordEventsInterface {
	[key: string]: DiscordSingleEventInterface;
}

export interface DiscordSingleEventInterface {
	enabled: boolean;
}

export interface DiscordCommandsInterface {}

export interface DiscordActionsInterface {}
