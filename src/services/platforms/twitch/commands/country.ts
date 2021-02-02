import fetch from 'node-fetch';
import { services } from '../../../../app.js';
import { MessageDBInterface } from '../../../../interfaces/message.js';
import { UserInterface } from '../../../../interfaces/user.js';

export default {
	run: async (channel: string, user: UserInterface, message: MessageDBInterface, args: string[]) => {
		if (args.length > 0) {
			const inCountry = args[0];
			let url = '';
			try {
				if (inCountry.length > 3 || inCountry.length < 2) {
					// Search for name
					url = `https://restcountries.eu/rest/v2/name/${inCountry}`;
				} else {
					// Search for code
					url = `https://restcountries.eu/rest/v2/alpha/${inCountry}`;
				}

				const res = await fetch(url);
				if (res.status !== 200) {
					services.bot.client.say(
						channel,
						`@${user.twitch?.displayName || 'Missing Name'}, etwas ist schief gegangen.`
					);
				}
				const json = await res.json();

				const country = {
					code: json.alpha2Code,
					name: json.translations.de,
					flag: json.flag
				};

				if (!user || !user._id) return null;
				const dbUser = await services.db.users.getUserByID(user._id);
				if (dbUser === null) return null;
				dbUser.country = country;
				await services.db.users.updateUser(dbUser);
			} catch (err) {
				services.logger.error(err);
				return null;
			}
		} else {
			services.bot.client.say(
				channel,
				`@${user.twitch?.displayName || 'Missing Name'}, du musst ein Länderkürzel oder ein Land angeben.`
			);
		}
	},
	aliases: ['flag'],
	description: 'default',
	clients: ['bf_mod']
};
