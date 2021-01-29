import { getCredentials } from '../config/credentials/credentialsConfig';
import { DB } from '../db/db';
import { Discord } from './platforms/discord/discord';
import { Twitch } from './platforms/twitch/twitch';
import { API } from '../api/api';
import { Teamspeak } from './platforms/teamspeak/teamspeak';
import { getTeamspeakGeneral } from '../config/teamspeak/teamspeakConfig';
import { getDiscordGeneral } from '../config/discord/discordConfig';
import { getTwitchGeneral } from '../config/twitch/twitchConfig';
import { Spotify } from './platforms/spotify/spotify';
import Logger from '../utils/logger/logger';
import { CredentialsInterface } from '../interfaces/config/credentials';
import { TwitchBot } from './platforms/twitch/twitchBot';

export class Services {
	initialized: boolean;
	logger: Logger;
	bot: TwitchBot;
	streamer: Twitch;
	dcbot: Discord;
	twitchViewer: Set<string>;
	teamspeak: Teamspeak;
	spotify: Spotify;
	db: DB;
	api: API;

	constructor(loggerLevel: string, credentials: CredentialsInterface) {
		this.initialized = false;
		this.logger = new Logger(loggerLevel);
		this.bot = new TwitchBot('bot', credentials);
		this.streamer = new Twitch('streamer', credentials);
		this.dcbot = new Discord('bot', credentials);
		this.twitchViewer = new Set();
		this.teamspeak = new Teamspeak(credentials);
		this.spotify = new Spotify();
		this.db = new DB(credentials);
		this.api = new API();
	}

	async initialize() {
		this.logger.info('[services] initializing started.');

		const credentials = await getCredentials();
		const teamspeakGeneral = await getTeamspeakGeneral();
		const discordGeneral = await getDiscordGeneral();
		const twitchGeneral = await getTwitchGeneral();

		// Twitch Bot Account
		if (twitchGeneral.activated) {
			this.logger.info('[services] Twitch bot');
			await this.bot.importCommands();
			await this.bot.importEvents();
			await this.bot.importActions();
			await this.bot.connect();
		}

		// Twitch Streamer Account
		if (twitchGeneral.activated) {
			this.logger.info('[services] Twitch streamer');
			await this.streamer.importCommands();
			await this.streamer.importEvents();
			await this.streamer.importActions();
			await this.streamer.connect();
		}

		// Discord Bot Account
		if (discordGeneral.activated) {
			this.logger.info('[services] Discord bot');
			await this.dcbot.importCommands();
			await this.dcbot.importEvents();
			await this.dcbot.importActions();
			await this.dcbot.connect(credentials);
		}

		// Teamspeak Bot
		if (teamspeakGeneral.activated) {
			this.logger.info('[services] Teamspeak bot');
			await this.teamspeak.connect();
			// await this.teamspeak.importEvents();
		}

		// API & Websocket
		await this.api.initialize();

		this.initialized = true;
		this.logger.info('[services] initializing completed.');
	}

	async addTwitchViewer(id: string) {
		this.twitchViewer.add(id);
	}

	async removeTwitchViewer(id: string) {
		this.twitchViewer.delete(id);
	}
}
