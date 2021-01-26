import { services } from '../../app.js';
import { getTwitchGeneral, getTwitchCommands } from '../../config/twitch/twitchConfig';
import { TwitchSingleCommandInterface } from '../../interfaces/config/twitch.js';
import { MessageDBInterface } from '../../interfaces/message.js';
import { UserInterface } from '../../interfaces/user.js';

export async function executeCommands(messageObject: MessageDBInterface, channel: string): Promise<void> {
	let generalTwitchConfig = await getTwitchGeneral();
	let commandsTwitchConfig = await getTwitchCommands();

	if (!messageObject || !messageObject.message) {
		console.log('cmd', messageObject);
		return;
	}

	const message = messageObject.message.message || '';
	const user = messageObject.user;

	if (message.startsWith(generalTwitchConfig.commandPrefix)) {
		let cmdArgs = message
			.substring(message.indexOf(generalTwitchConfig.commandPrefix) + 1)
			.split(new RegExp(/\s+/));
		if (!cmdArgs || cmdArgs.length > 0) {
			let cmdName = cmdArgs.shift()?.toLowerCase() || '';

			if (services.bot.commands.has(cmdName)) {
				const command = services.bot.commands.get(cmdName);

				if (commandsTwitchConfig[cmdName].channels.includes(channel.substring(1))) {
					if (!user || !user.twitch || !user.twitch.displayName) return;
					if (!(await checkPermissions(commandsTwitchConfig[cmdName], user))) {
						services.bot.client.say(
							channel,
							`Du hast keine Berechtigung, den Command !${cmdName} auszuführen, ${user.twitch.displayName}!`
						);
						return;
					}

					if (await checkCooldown(cmdName, commandsTwitchConfig[cmdName], channel)) {
						command?.run(channel, user, messageObject, cmdArgs);
					} else {
						console.log('cooldown');
					}
				} else {
					console.log('wrong channel');
				}
			} else {
				console.log('no command found');
			}
		}
	}
}

export async function checkPermissions(config: TwitchSingleCommandInterface, user: UserInterface) {
	switch (config.permission.toString()) {
		case 'custom':
			let allowedUsers = config.allowedUsers;
			allowedUsers.forEach((allowedUser) => {
				if (allowedUser === user.twitch?.name) {
					return true;
				}
			});
			break;

		case 'everyone':
			return true;

		case 'subscriber':
			if (user.twitch?.sub) {
				return true;
			}

		case 'vip':
			if (user.twitch?.vip) {
				return true;
			}

		case 'mod':
			if (user.twitch?.mod) {
				return true;
			}

		case 'broadcaster':
			if (user.twitch?.broadcaster) {
				return true;
			}
			break;
	}
	return false;
}

// TODO!
async function checkCooldown(cmdName: string, config: TwitchSingleCommandInterface, channel: string) {
	let wasUsed = false;
	let time = new Date(Date.now());

	let canExecute = true;

	services.bot.commandCooldowns.forEach((cooldown, name) => {
		if (name === cmdName) {
			wasUsed = true;
			try {
				let cooldownTime = config.cooldown || 0;
				if (+cooldown + +cooldownTime <= +time) {
					cooldown = time;
				} else {
					let remainingCooldown = (+cooldown + +cooldownTime - +time) / 1000;
					let minutes = Math.floor(+remainingCooldown / 60);
					let seconds = Math.floor(+remainingCooldown % 60);
					services.bot.client.say(
						channel,
						`Der Command !${cmdName} kann erst wieder in ${minutes} Minuten und ${seconds} Sekunden genutzt werden.`
					);
					canExecute = false;
				}
			} catch (err) {
				services.logger.error(err);
				return false;
			}
		}
	});

	services.bot.commandCooldowns.set(cmdName, time);
	return canExecute;
}
