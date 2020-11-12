import { services } from '../../app.js';
import { getTwitchGeneral, getTwitchCommands } from '../../config/twitch/twitchConfig.js';

export async function executeCommands(message, twitchID, channel) {
	let generalTwitchConfig = await getTwitchGeneral();
	let commandsTwitchConfig = await getTwitchCommands();

	if (message.startsWith(generalTwitchConfig.commandPrefix)) {
		let cmdArgs = message
			.substring(message.indexOf(generalTwitchConfig.commandPrefix) + 1)
			.split(new RegExp(/\s+/));
		let cmdName = cmdArgs.shift().toLowerCase();

		if (services.bot.commands.has(cmdName)) {
			const command = services.bot.commands.get(cmdName);

			if (commandsTwitchConfig[cmdName].channels.includes(channel.substring(1))) {
				if (!(await checkPermissions(commandsTwitchConfig[cmdName], twitchID))) {
					// TODO Say not allowed
					return;
				}

				if (await checkCooldown(cmdName, commandsTwitchConfig[cmdName], channel)) {
					services.bot.commands.get(cmdName).run(channel, twitchID, message, cmdArgs);
				}
			}
		}
	}
}

async function checkPermissions(config, twitchID) {
	const userdata = await services.db.users.getUserByTwitchID(twitchID);

	switch (config.permission.toString()) {
		case 'custom':
			let allowedUsers = config.allowedUsers;
			allowedUsers.forEach((allowedUser) => {
				if (allowedUser === userdata.twitch.name) {
					return true;
				}
			});
			break;

		case 'everyone':
			return true;

		case 'subscriber':
			if (userdata.twitch.sub) {
				return true;
			}

		case 'vip':
			if (userdata.twitch.vip) {
				return true;
			}

		case 'mod':
			if (userdata.twitch.mod) {
				return true;
			}

		case 'broadcaster':
			if (userdata.twitch.broadcaster) {
				return true;
			}
			break;
	}
	return false;
}

async function checkCooldown(cmdName, config, channel) {
	let wasUsed = false;
	let time = new Date(Date.now());

	services.bot.commandCooldowns.forEach((cooldown) => {
		if (cooldown.name === cmdName) {
			wasUsed = true;
			try {
				let cooldownTime = config.cooldown || 0;
				if (+cooldown.time + +cooldownTime <= +time) {
					cooldown.time = time;
					return true;
				} else {
					let remainingCooldown = (+cooldown.time + +cooldownTime - +time) / 1000;
					let minutes = Math.floor(+remainingCooldown / 60);
					let seconds = Math.floor(+remainingCooldown % 60);
					services.bot.client.say(
						channel,
						`Der Command !${cmdName} kann erst wieder in ${minutes} Minuten und ${seconds} Sekunden genutzt werden.`
					);
					return false;
				}
			} catch (err) {
				console.error(err);
			}
		}
	});
	if (!wasUsed) {
		services.bot.commandCooldowns.push({ name: cmdName, time: time });
		return true;
	}
}
