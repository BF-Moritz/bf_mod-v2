import fs from 'fs';
import path from 'path';
import tmi from 'tmi.js';
import { getTwitchActions, getTwitchEvents } from '../../../config/twitch/twitchConfig.js';
import { readFiles } from '../../../utils/miscellaneous/readFiles.js';
import { checkCommands } from '../../../utils/twitch/checkCommands.js';
import { checkEvents } from '../../../utils/twitch/checkEvents.js';
import { checkActions } from '../../../utils/twitch/checkActions.js';

const externalFilesPath = path.resolve('./src/services/platforms/twitch/');

export class Twitch {
	constructor(account) {
		this.commands = new Map();
		this.events = new Map();
		this.actions = new Map();
		this.account = account;
		this.commandCooldowns = [];
	}

	async setCredentials(credentials) {
		this.name = credentials.twitch[this.account].name;
		this.oAuth = credentials.twitch[this.account].oAuth;
		this.channels = credentials.twitch[this.account].channels;

		this.client = await new tmi.Client({
			options: {
				debug: true
			},
			connection: {
				reconnect: true,
				secure: true
			},
			identity: {
				username: this.name,
				password: this.oAuth
			},
			channels: this.channels
		});
	}

	async importCommands() {
		await readFiles(
			path.join(externalFilesPath, '/commands'),
			async (dir, file, params) => {
				let cmdName = file.substring(0, file.indexOf('.js'));
				try {
					let cmdModule = await import('file://' + path.join(dir, file));
					if (
						(await checkCommands(cmdName, cmdModule)) &&
						cmdModule.default.clients.includes(params.twitch.name)
					) {
						let { aliases } = cmdModule.default;
						params.twitch.commands.set(cmdName, cmdModule.default);
						if (aliases === undefined) {
							console.log(cmdName);
						}
						if (aliases.length !== 0) {
							aliases.forEach((alias) => {
								params.twitch.commands.set(alias, cmdModule.default);
							});
						}
					}
				} catch (err) {
					console.log(err);
				}
			},
			{ twitch: this }
		);
	}

	async importEvents() {
		const config = await getTwitchEvents();
		await readFiles(
			path.join(externalFilesPath, '/events'),
			async (dir, file, params) => {
				let eventName = file.substring(0, file.indexOf('.js'));
				try {
					let eventModule = await import('file://' + path.join(dir, file));
					if (
						(await checkEvents(eventName, eventModule)) &&
						eventModule.default.clients.includes(params.twitch.name)
					) {
						if (config[eventName].enabled) {
							params.twitch.client.on(eventName, eventModule.default.run);
							params.twitch.events.set(eventName, eventModule.default.run);
						}
					}
				} catch (err) {
					console.log(err);
				}
			},
			{ twitch: this }
		);
	}

	async importActions() {
		const config = await getTwitchActions();
		await readFiles(
			path.join(externalFilesPath, '/actions'),
			async (dir, file, params) => {
				let actionName = file.substring(0, file.indexOf('.js'));
				try {
					let actionModule = await import('file://' + path.join(dir, file));
					if (await checkActions(actionName, actionModule)) {
						if (config[actionName].enabled) {
							params.twitch.actions.set(actionName, actionModule.default.run);
						}
					}
				} catch (err) {
					console.log(err);
				}
			},
			{ twitch: this }
		);
	}

	async connect() {
		await this.client.connect();
	}
}
