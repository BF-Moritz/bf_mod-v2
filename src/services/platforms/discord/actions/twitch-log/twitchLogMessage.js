import Discord from 'discord.js';
import {services} from '../../../../../app.js'
import {getDiscordChannels, getDiscordGeneral} from '../../../../../config/discord/discordConfig.js';


export default {
	run: async (messageObject) => {
		let discordChannels = await getDiscordChannels();
		let discordGeneral = await getDiscordGeneral();
		let embed = new Discord.MessageEmbed();
		let user = await services.db.users.getUserByTwitchID(messageObject.message.twitchID);
		embed.setAuthor(user.twitch.displayName, user.twitch.logo, 'https://www.twitch.tv/' + user.twitch.name);
		embed.setTimestamp(messageObject.date);
		embed.addField('Message', messageObject.message.message);
		let twitchLogChannel = services.dcbot.client.channels.cache.find(channel => {
			return channel.id === discordChannels.logChannel.id;
		});
		if (twitchLogChannel !== null && discordGeneral.twitchLog) {
			twitchLogChannel.send(embed);
		} else {
			console.log(embed);
		}
	}
}