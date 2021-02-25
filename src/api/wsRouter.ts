import { services } from '../app';
import { getCredentials } from '../config/credentials/credentialsConfig';
import { send } from '../utils/twitch/websocketUtils';
import * as ws from 'ws';
import {
	ConnectDataInterface,
	GetMessagesDataInterface,
	GetUserInformationDataInterfac,
	GetViewerDataInterface,
	PostActionDataInterface,
	PostMessageDataInterface
} from '../interfaces/websockets/websockets';
import { MessageDBInterface } from '../interfaces/message';
import { CurrentlyPlayingInterface } from '../interfaces/spotify/currentlyPlaying.api';

export class WSRouter {
	webSockets: ws[];

	constructor() {
		this.webSockets = [];
	}

	router = (ws: ws) => {
		ws.on('message', async (message) => {
			try {
				const data = JSON.parse(message.toString());
				switch (data.method) {
					case 'CONNECT':
						await this.wsConnect(ws, data.params);
						break;
					case 'GET':
						switch (data.type) {
							case 'messages':
								await this.wsGetMessages(ws, data.params);
								break;
							case 'viewer':
								await this.wsGetViewer(ws, data.params);
								break;
							case 'user-information':
								await this.wsGetUserInformation(ws, data.params);
						}
						break;
					case 'POST':
						switch (data.type) {
							case 'message':
								await this.wsPostMessages(ws, data.params);
								break;
							case 'action':
								await this.wsPostAction(ws, data.params);
								break;
						}
						break;
				}
			} catch (err) {
				console.error(err);
			}
		});
	};

	wsConnect = async (ws: ws, inData: ConnectDataInterface) => {
		if (!inData.client) return;

		this.webSockets.push(ws);
		const credentials = await getCredentials();
		let data = {};

		switch (inData.client) {
			case 'native':
			case 'bf-chat':
				data = {
					method: 'CONNECT',
					type: 'CONNECT',
					params: {
						settings: {
							apiKey: credentials.youtube.apiKey,
							twitchAccounts: [credentials.twitch.streamer.name, credentials.twitch.bot.name]
						}
					}
				};
				break;

			case 'bf_mod':
				data = {
					method: 'CONNECT',
					type: 'CONNECT',
					params: {}
				};
				break;

			case 'bf-activity':
				data = {
					method: 'CONNECT',
					type: 'CONNECT',
					params: {
						settings: {}
					}
				};
				break;

			case 'bf_chat-window':
				data = {
					method: 'CONNECT',
					type: 'CONNECT',
					params: {
						settings: {
							apiKey: credentials.youtube.apiKey
						}
					}
				};
				break;

			case 'bf-overlay':
				data = {
					method: 'CONNECT',
					type: 'CONNECT',
					params: {}
				};
				break;

			default:
				services.logger.warn('[ws-router] - missing client:', inData.client);
				break;
		}

		if (!send(ws, data)) {
			await this.clearDisconnectedUsers();
		}
	};

	/**
	 *	Gets a number of Messages from the Messages DB
	 * @param {WebSocket} ws
	 * @param {Object} params
	 */
	wsGetMessages = async (ws: ws, params: GetMessagesDataInterface): Promise<void> => {
		let count = 50;
		let index = ((await services.db.twitchMessages.countMessages()) || 0) - 1;
		if (params !== null && params.count !== undefined) {
			count = params.count;
		}
		if (params !== null && params.index !== undefined) {
			index = Math.min(params.index, index);
		}

		if (index < 0) {
			return;
		}

		let messages = [];
		for (let i = index; i > index - count && i >= 0; i--) {
			const messageObject = await services.db.twitchMessages.getMessageByIndex(i);
			if (!messageObject.message.twitchID) {
				services.logger.warn('[ws-router] missing twitch id', messageObject);
			}
			messageObject.user = await services.db.users.getUserByTwitchID(messageObject.message.twitchID);
			messages.unshift(messageObject);
		}

		let data = {
			method: 'POST',
			type: 'messages',
			params: {
				messages: messages
			}
		};

		if (!send(ws, data)) {
			await this.clearDisconnectedUsers();
		}
	};

	wsGetViewer = async (ws: ws, params: GetViewerDataInterface) => {};

	wsPostMessages = async (ws: ws, params: PostMessageDataInterface) => {
		const { author, message } = params;
		switch (author.toLowerCase()) {
			case services.streamer.name:
				services.streamer.client.say(services.streamer.channels[0].substring(1), message);
				break;

			case services.bot.name:
				services.bot.client.say(services.bot.channels[0].substring(1), message);
				break;
		}
	};

	wsPostAction = async (ws: ws, params: PostActionDataInterface) => {
		if (params.platform === 'twitch') {
			if (!services.streamer.actions.has(params.action)) {
				console.error(`No Action named <${params.action}>!`);
				return;
			}

			const fnctn = services.streamer.actions.get(params.action);
			if (!fnctn) return;
			let result = await fnctn(params);

			if (result !== null && typeof result === 'object') {
				send(ws, {
					method: 'POST',
					type: 'action-response',
					params: {
						result: result,
						action: params.action,
						id: params.id
					}
				});
			}
		}
		await services.api;
	};

	wsAddViewer = async (viewer: string) => {
		// TODO add viewer to viewer list and send whole list to all websockets
	};

	wsRemoveViewer = async (viewer: string) => {
		// TODO remove viewer from viewer list and send whole list to all websockets
	};

	wsAddMessage = async (message: MessageDBInterface) => {
		for (let i = 0; i < this.webSockets.length; i++) {
			let data = {
				method: 'POST',
				type: 'messages',
				params: {
					messages: [message]
				}
			};
			send(this.webSockets[i], data);
		}
	};

	wsAddEvent = async (event: any) => {
		// TODO split into params based on event
	};

	clearDisconnectedUsers = async () => {
		for (let i = 0; i < this.webSockets.length; i) {
			if (this.webSockets[i].readyState !== 1) {
				this.webSockets.splice(i, 1);
			} else {
				i++;
			}
		}
	};

	wsGetUserInformation = async (ws: ws, params: GetUserInformationDataInterfac) => {
		let user = await services.db.users.getUserByID(params.id);
		send(ws, {
			method: 'POST',
			type: 'user-information',
			params: {
				user: user
			}
		});
	};

	wsUpdateSpotifyPlayback = async (info: CurrentlyPlayingInterface) => {
		for (let i = 0; i < this.webSockets.length; i++) {
			let data = {
				method: 'POST',
				type: 'spotify',
				params: {
					info: info
				}
			};
			send(this.webSockets[i], data);
		}
	};
}
