import { getCredentials } from '../config/credentials/credentialsConfig.js';
import { DB } from '../db/db.js';
import { Discord } from './platforms/discord/discord.js';
import { Twitch } from './platforms/twitch/twitch.js';
import { API } from '../api/api.js';

export class Services {
	constructor() {
		this.bot = new Twitch('bot');
		this.streamer = new Twitch('streamer');
		this.dcbot = new Discord('bot');
		this.twitchViewer = [];
		this.initialized = false;
	}

	async initialize() {
		let credentials = await getCredentials();

		// MongoDB
		this.db = new DB(credentials);

		// Twitch Bot Account
		await this.bot.setCredentials(credentials);
		await this.bot.importCommands();
		await this.bot.importEvents();
		await this.bot.importActions();
		await this.bot.connect();

		// Twitch Streamer Account
		await this.streamer.setCredentials(credentials);
		await this.streamer.importCommands();
		await this.streamer.importEvents();
		await this.streamer.importActions();
		await this.streamer.connect();

		// Discord Bot Account
		await this.dcbot.setCredentials(credentials);
		await this.dcbot.importCommands();
		await this.dcbot.importEvents();
		await this.dcbot.importActions();
		await this.dcbot.connect(credentials);

		// API & Websocket
		this.api = new API();
		await this.api.initialize();

		this.initialized = true;
	}

	async addTwitchViewer(id) {
		await this.twitchViewer.push(id);
	}

	async removeTwitchViewer(id) {
		while (this.twitchViewer.findIndex((element) => element === id) > 0) {
			this.twitchViewer.splice(
				this.twitchViewer.findIndex((element) => element === id),
				1
			);
		}
	}
}
