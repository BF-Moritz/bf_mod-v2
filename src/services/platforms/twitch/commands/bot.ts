import { services } from '../../../../app';
import { MessageDBInterface } from '../../../../interfaces/message';
import { UserInterface } from '../../../../interfaces/user';

export default {
	run: async (channel: string, user: UserInterface, message: MessageDBInterface, args: string[]) => {
		services.bot.client.say(
			channel,
			`Der Bot wird aktuell von mir entwickelt. Den Source Code findest du hier: https://github.com/BF-Moritz/bf_mod-v2`
		);
	},
	aliases: [],
	description: 'bot',
	clients: ['bf_mod']
};
