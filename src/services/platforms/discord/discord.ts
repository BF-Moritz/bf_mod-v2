import discord from 'discord.js';
import path from 'path';
import { services } from '../../../app';
import { checkActions } from '../../../utils/discord/checkActions';
import { readFiles } from '../../../utils/miscellaneous/readFiles';
import { generateString } from '../../../utils/random/string';
import { CredentialsInterface } from '../../../interfaces/config/credentials';
import { DiscordImportObjectInterface } from '../../../interfaces/discord/import';
import { checkEvents } from '../../../utils/discord/checkEvents';
import { getDiscordEvents } from '../../../config/discord/discordConfig';

const externalFilesPath = path.resolve('./src/services/platforms/discord/');

export class Discord {
	commands: Map<string, Function>;
	events: Map<string, Function>;
	actions: Map<string, Function>;
	account: string;
	authMap: Map<any, any>; // TODO
	client: discord.Client;

	constructor(account: string, credentials: CredentialsInterface) {
		this.commands = new Map();
		this.events = new Map();
		this.actions = new Map();
		this.account = account;
		this.authMap = new Map();
		this.client = new discord.Client();
	}

	async importCommands() {
		await readFiles(
			path.join(externalFilesPath, '/commands'),
			async (dir: string, file: string, params: Object) => {
				let cmdName = file.substring(0, file.indexOf('.js'));
				try {
					services.logger.debug(cmdName);
				} catch (err) {
					services.logger.error(err);
				}
			},
			{ discord: this }
		);
	}

	async importEvents() {
		const config = await getDiscordEvents();
		await readFiles(
			path.join(externalFilesPath, '/events'),
			async (dir: string, file: string, params: DiscordImportObjectInterface) => {
				let eventName = file.substring(0, file.indexOf('.js'));
				try {
					let eventModule = await import(path.join(dir, file));
					if (await checkEvents(eventName, eventModule)) {
						if (config[eventName].enabled) {
							params.discord.client.on(eventName, eventModule.default.run);
							params.discord.events.set(eventName, eventModule.default.run);
							services.logger.info(`[discord] - registered event ${eventName}`);
						}
					}
				} catch (err) {
					services.logger.error(err);
				}
			},
			{ discord: this }
		);
	}

	async importActions() {
		await readFiles(
			path.join(externalFilesPath, '/actions'),
			async (dir: string, file: string, params: DiscordImportObjectInterface) => {
				let actionName = file.substring(0, file.indexOf('.js'));
				try {
					let actionModule = await import(path.join(dir, file));
					if (await checkActions(actionName, actionModule)) {
						params.discord.actions.set(actionName, actionModule.default.run);
					}
				} catch (err) {
					services.logger.error(err);
				}
			},
			{ discord: this }
		);
	}

	async connect(credentials: CredentialsInterface) {
		await this.client.login(credentials.discord.token);
	}

	async createAuthToken(id: string) {
		const user = await services.db.users.getUserByTwitchID(id);
		if (!user || user.discord) return null;

		let userID;
		do {
			userID = generateString(8);
		} while (this.authMap.has(userID));

		this.authMap.set(userID, user._id);
		return userID;
	}
}
