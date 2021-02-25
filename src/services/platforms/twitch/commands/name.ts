import { services } from '../../../../app.js';
import { MessageDBInterface } from '../../../../interfaces/message.js';
import { UserInterface } from '../../../../interfaces/user.js';

export default {
	run: async (channel: string, user: UserInterface, message: MessageDBInterface, args: string[]) => {
		if (args.length > 0) {
			const name = args.join(' ');
			try {
				if (user === undefined || user._id === undefined) return;
				const dbUser = await services.db.users.getUserByID(user._id);
				if (dbUser === null) return;
				dbUser.name = name;
				await services.db.users.updateUser(dbUser);
			} catch (err) {
				services.logger.error(err);
				return null;
			}
		} else {
			services.bot.client.say(
				channel,
				`@${user.twitch?.displayName || 'Missing Name'}, du musst einen Namen angeben.`
			);
		}
	},
	aliases: ['setname'],
	description: 'default',
	clients: ['bf_mod']
};
