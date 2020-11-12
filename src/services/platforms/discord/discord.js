import discord from 'discord.js';
import path from 'path';
import { checkActions } from '../../../utils/discord/checkActions.js';
import { readFiles } from '../../../utils/miscellaneous/readFiles.js';

const externalFilesPath = path.resolve('./src/services/platforms/discord/');

export class Discord {
	constructor(account) {
		this.commands = new Map();
		this.events = new Map();
		this.actions = new Map();
		this.account = account;
	}

	async setCredentials(credentials) {
		this.client = new discord.Client();
	}

	async importCommands() {
		await readFiles(
			path.join(externalFilesPath, '/commands'),
			async (dir, file, params) => {
				let cmdName = file.substring(0, file.indexOf('.js'));
				try {
					console.log(cmdName);
				} catch (err) {
					console.log(err);
				}
			},
			{ discord: this }
		);
	}

	async importEvents() {
		await readFiles(
			path.join(externalFilesPath, '/events'),
			async (dir, file, params) => {
				let eventName = file.substring(0, file.indexOf('.js'));
				try {
					console.log(eventName);
				} catch (err) {
					console.log(err);
				}
			},
			{ discord: this }
		);
	}

	async importActions() {
		await readFiles(
			path.join(externalFilesPath, '/actions'),
			async (dir, file, params) => {
				let actionName = file.substring(0, file.indexOf('.js'));
				try {
					let actionModule = await import('file://' + path.join(dir, file));
					if (await checkActions(actionName, actionModule)) {
						params.discord.actions.set(actionName, actionModule.default.run);
					}
				} catch (err) {
					console.log(err);
				}
			},
			{ discord: this }
		);
	}

	async connect(credentials) {
		await this.client.login(credentials.discord.token);
	}
}
