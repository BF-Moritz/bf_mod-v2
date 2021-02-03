export interface DiscordEventsModuleInterface {
	default: DiscordEventsModuleDefaultInterface;
}

export interface DiscordEventsModuleDefaultInterface {
	run: Function;
}
