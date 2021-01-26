export interface TwitchCommandsModuleInterface {
	default: TwitchCommandsModuleDefaultInterface;
}

export interface TwitchCommandsModuleDefaultInterface {
	run: Function;
	aliases: string[];
	description: string;
	clients: string[];
}
