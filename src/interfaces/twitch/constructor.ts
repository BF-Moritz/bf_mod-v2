import { MessageDBInterface } from '../message';
import { UserInterface } from '../user';

export interface TwitchCommandObjectInterface {
	run(channel: string, user: UserInterface, message: MessageDBInterface, args: string[]): Promise<void>;
	aliases: string[];
	description: string;
	clients: string[];
}

export interface TwitchCommandRunInterface {}
