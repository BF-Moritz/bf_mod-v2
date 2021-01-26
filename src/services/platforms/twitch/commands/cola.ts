import { services } from '../../../../app.js';
import { MessageDBInterface } from '../../../../interfaces/message.js';
import { UserInterface } from '../../../../interfaces/user';

export default {
	run: async (channel: string, user: UserInterface, message: MessageDBInterface, args: string[]) => {
		services.bot.client.say(channel, `Jaja ${user.twitch?.displayName}, ich trink ja schon!`);
	},
	aliases: ['bfmoricola'],
	description: 'cola',
	clients: ['bf_mod']
};
