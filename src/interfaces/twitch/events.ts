export interface TwitchEventsModuleInterface {
	default: TwitchEventsModuleDefaultInterface;
}

export interface TwitchEventsModuleDefaultInterface {
	run: Function;
	clients: string[];
}
