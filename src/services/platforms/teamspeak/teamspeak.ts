import path from 'path';
import { TeamSpeak as ts3 } from 'ts3-nodejs-library';
import { Whoami } from 'ts3-nodejs-library/lib/types/ResponseTypes';
import { services } from '../../../app';
import { CredentialsInterface } from '../../../interfaces/config/credentials';

const externalFilesPath = path.resolve('./src/services/platforms/teamspeak/');

export class Teamspeak {
	client: ts3 | undefined;
	clientInfo: Whoami | null;
	host: string;
	serverport: number;
	username: string;
	password: string;
	nickname: string;
	defaultChannelID: string;

	constructor(credentials: CredentialsInterface) {
		this.client;
		this.clientInfo = null;
		this.host = credentials.teamspeak.host;
		this.serverport = credentials.teamspeak.serverport;
		this.username = credentials.teamspeak.username;
		this.password = credentials.teamspeak.password;
		this.nickname = credentials.teamspeak.nickname;
		this.defaultChannelID = credentials.teamspeak.defaultChannelID;
	}

	connect = async () => {
		this.client = await ts3.connect({
			host: this.host,
			serverport: this.serverport,
			username: this.username,
			password: this.password,
			nickname: this.nickname,
			keepAlive: true
		});

		// keeps the bot from disconnecting
		setInterval(async () => {
			this.clientInfo = (await this.client?.whoami()) || null;
		}, 10000);

		// this.client.on('channelcreate', (err) => console.error(err));
		// this.client.on('clientconnect', (err) => console.error(err));
		// this.client.on('clientdisconnect', (err) => console.error(err));
		// this.client.on('clientmoved', (err) => console.error(err));
		this.client.on('error', (err) => console.error(err));
		this.client.on('close', async (err) => {
			console.error('connection closed. (' + err + ')');
			await this.client?.reconnect(-1, 1000);
			services.logger.warn('reconnected.');
		});
	};

	// TODO better import of events
	// importEvents = async () => {
	// 	const config = await getTeamspeakEvents();
	// 	await readFiles(
	// 		path.join(externalFilesPath, '/events'),
	// 		async (dir: string, file: string) => {
	// 			let eventName = file.substring(0, file.indexOf('.js'));
	// 			try {
	// 				let eventModule = await import(path.join(dir, file));
	// 				if (await checkEvents(eventName, eventModule)) {
	// 					// if (config[eventName].enabled) {
	// 					this.client?.on(eventName as TeamspeakEventType, eventModule.default.run);
	// 					// }
	// 				}
	// 			} catch (err) {
	// 				services.logger.error(err);
	// 			}
	// 		},
	// 		{ twitch: this }
	// 	);
	// };
}
