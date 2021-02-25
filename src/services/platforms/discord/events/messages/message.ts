import { Message } from 'discord.js';
import { getDiscordChannels } from '../../../../../config/discord/discordConfig';

export default {
	run: async (message: Message) => {
		const channels = await getDiscordChannels();
		switch (message.channel.id) {
			case channels.logChannel.id:
				return;
			case channels.commandsChannel.id:
				return;
			default:
				console.log(message.channel.id);

				break;
		}
	}
};
