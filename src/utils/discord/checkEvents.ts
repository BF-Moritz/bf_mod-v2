import { DiscordEventsModuleInterface } from '../../interfaces/discord/events';

export async function checkEvents(eventName: string, eventModule: DiscordEventsModuleInterface): Promise<boolean> {
	return true;
}
