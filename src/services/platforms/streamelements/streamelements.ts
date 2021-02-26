import { CredentialsInterface } from '../../../interfaces/config/credentials';
import socketIO from 'socket.io-client';
import { services } from '../../../app';

export class StreamElements {
	private socket: SocketIOClient.Socket | null;
	private jwt: string;
	channelID: string | null;
	constructor(credentials: CredentialsInterface) {
		this.socket = null;
		this.jwt = credentials.streamElements.jwtToken;
		this.channelID = null;
	}

	async init() {
		this.socket = socketIO('https://realtime.streamelements.com', {
			transports: ['websocket']
		});
		this.socket.on('connect', this.auth);
		this.socket.on('authenticated', this.authenticated);
		this.socket.on('event:test', (data: any) => {
			// TEST DATEN

			this.handleEvents(data);
		});
		this.socket.on('event', (data: any) => {
			// REALE DATEN
			this.handleEvents(data);
		});
	}

	auth = async () => {
		this.socket?.emit('authenticate', {
			method: 'jwt',
			token: this.jwt
		});
	};

	authenticated = async (data: any) => {
		this.channelID = data.channelId;
	};

	handleEvents(event: any) {
		switch (event.listener) {
			case 'follower-latest':
				services.bot.eventsHandler.channel?.send({
					event: 'follower-latest',
					group: 'follower',
					...event.event
				});
				break;
			case 'tip-latest':
				services.bot.eventsHandler.channel?.send({
					event: 'tip-latest',
					group: 'donation',
					...event.event
				});
				break;
			default:
				console.log(event);
				break;
		}
	}
}
