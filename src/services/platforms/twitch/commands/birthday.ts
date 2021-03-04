import moment from 'moment';
import { services } from '../../../../app';
import { MessageDBInterface } from '../../../../interfaces/message';
import { UserBirthdayInterface, UserInterface } from '../../../../interfaces/user';
import { setBirthday } from '../../../../utils/user/setBirthday';

export default {
	run: async (channel: string, user: UserInterface, message: MessageDBInterface, args: string[]) => {
		if (args.length !== 1) {
			services.bot.client.say(
				channel,
				`@${user.twitch?.name} Bitte gib "!birthday DD.MM.YYY" oder "!birthday DD.MM." ein.`
			);
			return;
		}
		if (!user._id) return;

		let birthday: UserBirthdayInterface;
		if (/[0-9]{2}.[0-9]{2}.[0-9]{4}/.test(args[0])) {
			if (moment(args[0], 'DD.MM.YYYY').isValid()) {
				const [day, month, year] = args[0].split('.');
				birthday = {
					day: parseInt(day),
					month: parseInt(month),
					year: parseInt(year)
				};
				if (!(await setBirthday(user._id, birthday))) {
					services.bot.client.say(channel, `@${user.twitch?.name} Something went wrong...`);
					return;
				}
			}
		} else if (/[0-9]{2}.[0-9]{2}./.test(args[0])) {
			if (moment(args[0] + 2004, 'DD.MM.YYYY').isValid()) {
				const [day, month] = args[0].split('.');
				birthday = {
					day: parseInt(day),
					month: parseInt(month)
				};
				if (!(await setBirthday(user._id, birthday))) {
					services.bot.client.say(channel, `@${user.twitch?.name} Something went wrong...`);
					return;
				}
			}
		} else {
			services.bot.client.say(
				channel,
				`@${user.twitch?.name} Bitte gib "!birthday DD.MM.YYYY" oder "!birthday DD.MM." ein.`
			);
		}
	},
	aliases: ['geburtstag'],
	description: 'bot',
	clients: ['bf_mod']
};
