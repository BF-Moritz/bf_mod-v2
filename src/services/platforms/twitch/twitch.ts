import path from 'path';
import tmi from 'tmi.js';
import { getTwitchActions, getTwitchEvents } from '../../../config/twitch/twitchConfig';
import { readFiles } from '../../../utils/miscellaneous/readFiles';
import { checkCommands } from '../../../utils/twitch/checkCommands';
import { checkEvents } from '../../../utils/twitch/checkEvents';
import { checkActions } from '../../../utils/twitch/checkActions';
import { services } from '../../../app';
import { CredentialsInterface } from '../../../interfaces/config/credentials';
import { TwitchImportObjectInterface } from '../../../interfaces/twitch/import';
import { TwitchCommandObjectInterface } from '../../../interfaces/twitch/constructor';

const externalFilesPath = path.resolve('./src/services/platforms/twitch/');

export class Twitch {
	commands: Map<string, TwitchCommandObjectInterface>;
	events: Map<string, Function>;
	actions: Map<string, Function>;
	account: 'bot' | 'streamer';
	commandCooldowns: Map<string, Date>;
	name: string;
	oAuth: string;
	channels: string[];
	client: tmi.Client;

	constructor(account: 'bot' | 'streamer', credentials: CredentialsInterface) {
		this.commands = new Map();
		this.events = new Map();
		this.actions = new Map();
		this.account = account;
		this.commandCooldowns = new Map();

		this.name = credentials.twitch[this.account].name;
		this.oAuth = credentials.twitch[this.account].oAuth;
		this.channels = credentials.twitch[this.account].channels;

		this.client = new tmi.Client({
			options: {
				debug: false
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
			path.join(__dirname, '/commands'),
			async (dir: string, file: string, params: TwitchImportObjectInterface) => {
				let cmdName = file.substring(0, file.indexOf('.js'));
				try {
					let cmdModule = await import(path.join(dir, file));
					if (
						(await checkCommands(cmdName, cmdModule)) &&
						cmdModule.default.clients.includes(params.twitch.name)
					) {
						let { aliases } = cmdModule.default;
						params.twitch.commands.set(cmdName, cmdModule.default);
						services.logger.info(`[twitch] - registered command ${cmdName}`);
						if (aliases && aliases.length !== 0) {
							aliases.forEach((alias: string) => {
								params.twitch.commands.set(alias, cmdModule.default);
							});
						}
					}
				} catch (err) {
					services.logger.error(err);
				}
			},
			{ twitch: this }
		);
	}

	async importEvents() {
		const config = await getTwitchEvents();
		await readFiles(
			path.join(externalFilesPath, '/events'),
			async (dir: string, file: string, params: TwitchImportObjectInterface) => {
				let eventName = file.substring(0, file.indexOf('.js'));
				try {
					let eventModule = await import(path.join(dir, file));
					if (
						(await checkEvents(eventName, eventModule)) &&
						eventModule.default.clients.includes(params.twitch.name)
					) {
						if (config[eventName].enabled) {
							params.twitch.client.on(eventName as keyof tmi.Events, eventModule.default.run);
							params.twitch.events.set(eventName, eventModule.default.run);
							services.logger.info(`[twitch] - registered event ${eventName}`);
						}
					}
				} catch (err) {
					services.logger.error(err);
				}
			},
			{ twitch: this }
		);
	}

	async importActions() {
		const config = await getTwitchActions();
		await readFiles(
			path.join(externalFilesPath, '/actions'),
			async (dir: string, file: string, params: TwitchImportObjectInterface) => {
				let actionName = file.substring(0, file.indexOf('.js'));
				try {
					let actionModule = await import(path.join(dir, file));
					if (await checkActions(actionName, actionModule)) {
						if (config[actionName].enabled) {
							params.twitch.actions.set(actionName, actionModule.default.run);
							services.logger.info(`[twitch] - registered action ${actionName}`);
						}
					}
				} catch (err) {
					services.logger.error(err);
				}
			},
			{ twitch: this }
		);
	}

	async connect() {
		await this.client.connect();
		return this.channels.map((c) => c.substring(1));
	}
}
