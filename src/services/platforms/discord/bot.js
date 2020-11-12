const discord = require('discord.js');
const fsPromise = require('fs').promises;
const path = require('path');
const {checkEvents} = require('../../../utils/discord/checkEvents.js');
const {checkCommands} = require('../../../utils/discord/checkCommands.js');

const {getCredentials} = require('../../../config/credentials/credentialsConfig.js');

module.exports.createDiscordBot = async () => {
	let credentials = await getCredentials();
	const discordBot = await new discord.Client();
	
	discordBot.commands = new Map();
	discordBot.events = new Map();
	
	await discordBot.login(credentials.discord.token);
	await registerCommands(discordBot, '/commands');
	await registerEvents(discordBot, '/events');
	return discordBot;
};

// DISCORD COMMANDS INITIALIZATION
async function registerCommands(discordBot, dir) {
	let files = await fsPromise.readdir(path.join(__dirname, dir));
	for (let file of files) {
		let stat = await fsPromise.lstat(path.join(__dirname, dir, file));
		if (stat.isDirectory()) {
			await registerCommands(discordBot, path.join(dir, file));
		} else {
			if (file.endsWith('.js')) {
				let cmdName = file.substring(0, file.indexOf('.js'));
				try {
					let cmdModule = require(path.join(__dirname, dir, file));
					if (await checkCommands(cmdName, cmdModule)) {
						let {aliases} = cmdModule;
						discordBot.commands.set(cmdName, cmdModule.run);
						if (aliases.length !== 0) {
							aliases.forEach(alias => discordBot.commands.set(alias, cmdModule.run));
						}
					} else {
						console.log(`Missing Config for Discord:${cmdName}`);
					}
				} catch (err) {
					console.log(err);
				}
			}
		}
	}
}

// DISCORD EVENTS INITIALIZATION
async function registerEvents(discordBot, dir) {
	let files = await fsPromise.readdir(path.join(__dirname, dir));
	for (let file of files) {
		let stat = await fsPromise.lstat(path.join(__dirname, dir, file));
		if (stat.isDirectory()) {
			await registerEvents(discordBot, path.join(dir, file));
		} else if (file.endsWith('.js')) {
			let eventName = file.substring(0, file.indexOf('.js'));
			try {
				let eventModule = require(path.join(__dirname, dir, file));
				if (await checkEvents(eventName, eventModule)) {
					discordBot.on(eventName, eventModule.bind(null));
					discordBot.events.set(eventName, eventModule);
				} else {
					console.log(`Missing Config for Discord:${eventName}`);
				}
			} catch (err) {
				console.log(err);
			}
		}
	}
}