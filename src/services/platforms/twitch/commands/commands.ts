import { services } from '../../../../app.js';
import { getTwitchCommands } from '../../../../config/twitch/twitchConfig.js';
import { MessageDBInterface } from '../../../../interfaces/message.js';
import { UserInterface } from '../../../../interfaces/user.js';
import { sleep } from '../../../../utils/miscellaneous/sleep.js';
import { checkPermissions } from '../../../../utils/twitch/executeCommands.js';

export default {
	run: async (channel: string, user: UserInterface, message: MessageDBInterface, args: string[]) => {
		const conf = await getTwitchCommands();

		if (args && args.length <= 0) {
			const cmds: string[] = [];
			const names: string[] = [];

			services.bot.commands.forEach((_, key) => {
				names.push(key);
			});

			for (let name of names) {
				if (conf[name] && (await checkPermissions(conf[name], user)) && !conf[name].private) {
					cmds.push(name);
				}
			}

			const output = `Alle verfügbaren commands sind: ${cmds.join(
				', '
			)}. Für mehr informationen: !commands <command name>`;

			services.bot.client.say(channel, output);
		} else if (conf[args[0]] && (await checkPermissions(conf[args[0]], user)) && !conf[args[0]].private) {
			services.bot.client.say(channel, services.bot.commands.get(args[0])?.description || 'No description found');
		} else {
			services.bot.client.say(channel, `There is no Command called ${args[0]}`);
		}
	},
	aliases: [],
	description: 'commands',
	clients: ['bf_mod']
};
