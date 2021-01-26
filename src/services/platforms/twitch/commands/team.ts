import { services } from '../../../../app.js';
import { MessageDBInterface } from '../../../../interfaces/message.js';
import { UserInterface } from '../../../../interfaces/user.js';

export default {
	run: async (channel: string, user: UserInterface, message: MessageDBInterface, args: string[]) => {
		if (args.length > 0) {
			const team = args[0];
			try {
				if (user === undefined || user._id === undefined) return;
				const dbUser = await services.db.users.getUserByID(user._id);
				if (dbUser === null) return;
				dbUser.team = team;
				await services.db.users.updateUser(dbUser);
			} catch (err) {
				services.logger.error(err);
				return null;
			}
		} else {
			services.bot.client.say(
				channel,
				`@${
					user.twitch?.displayName || 'Missing Name'
				}, du musst ein Team angeben. Alle verfügbaren Teams findest du hier: https://fontawesome.com/cheatsheet/free/brands`
			);
		}
	},
	aliases: ['flag'],
	description: 'default',
	clients: ['bf_mod']
};
