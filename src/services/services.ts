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
import { LoggerLevelType } from '../types/logger';
import { StreamElements } from './platforms/streamelements/streamelements';
import { TwitchState } from './platforms/twitch/twitchState';
import BTTV from './platforms/twitch/api/bttv/bttv';

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
	streamElements: StreamElements;
	twitchState: TwitchState;
	bttv: BTTV;

	constructor(loggerLevel: LoggerLevelType, credentials: CredentialsInterface) {
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
		this.streamElements = new StreamElements(credentials);
		this.twitchState = new TwitchState();
		this.bttv = new BTTV();
	}

	async initialize(credentials: CredentialsInterface) {
		this.logger.info('[services] - initializing started.');

		const teamspeakGeneral = await getTeamspeakGeneral();
		const discordGeneral = await getDiscordGeneral();
		const twitchGeneral = await getTwitchGeneral();

		// Twitch Bot Account
		if (twitchGeneral.activated) {
			this.logger.info('[services] - Twitch bot initializing');
			await this.bot.importCommands();
			await this.bot.importEvents();
			await this.bot.importActions();
			await this.bot.connect();
			this.logger.info('[services] - Twitch bot initialized');
		}

		// Twitch Streamer Account
		if (twitchGeneral.activated) {
			this.logger.info('[services] - Twitch streamer initializing');
			await this.streamer.importCommands();
			await this.streamer.importEvents();
			await this.streamer.importActions();
			await this.streamer.connect();
			this.logger.info('[services] - Twitch streamer initialized');
		}

		// Discord Bot Account
		if (discordGeneral.activated) {
			this.logger.info('[services] - Discord bot initializing');
			await this.dcbot.connect(credentials);
			await this.dcbot.importCommands();
			await this.dcbot.importEvents();
			await this.dcbot.importActions();
			this.logger.info('[services] - Discord bot initialized');
		}

		// Teamspeak Bot
		if (teamspeakGeneral.activated) {
			this.logger.info('[services] - Teamspeak bot initializing');
			await this.teamspeak.connect();
			// await this.teamspeak.importEvents();
			this.logger.info('[services] - Teamspeak bot initialized');
		}

		if (true) {
			// TODO
			this.logger.info('[services] - StreamElements initializing');
			await this.streamElements.init();
			// await this.teamspeak.importEvents();
			this.logger.info('[services] - StreamElements initialized');
		}

		if (true) {
			// TODO
			this.logger.info('[services] - BTTV initializing');
			await this.bttv.start();
			this.logger.info('[services] - BTTV initialized');
		}

		// API & Websocket
		await this.api.initialize(credentials);

		this.initialized = true;
		this.logger.info('[services] - initializing completed.');
	}

	async addTwitchViewer(id: string) {
		this.twitchViewer.add(id);
	}

	async removeTwitchViewer(id: string) {
		this.twitchViewer.delete(id);
	}
}
