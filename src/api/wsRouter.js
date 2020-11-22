import { services } from '../app.js';
import { getCredentials } from '../config/credentials/credentialsConfig.js';
import { send } from '../utils/twitch/websocketUtils.js';

export class WSRouter {
	constructor() {
		this.webSockets = [];
	}

	router(ws, req) {
		ws.on('message', async (message) => {
			try {
				const data = JSON.parse(message);
				switch (data.method) {
					case 'CONNECT':
						await services.api.wsRouter.wsConnect(ws);
						break;
					case 'GET':
						switch (data.type) {
							case 'messages':
								await services.api.wsRouter.wsGetMessages(ws, data.params);
								break;
							case 'viewer':
								await services.api.wsRouter.wsGetViewer(ws, data.params);
								break;
							case 'user-information':
								await services.api.wsRouter.wsGetUserInformation(ws, data.params);
						}
						break;
					case 'POST':
						switch (data.type) {
							case 'message':
								await services.api.wsRouter.wsPostMessages(ws, data.params);
								break;
							case 'action':
								await services.api.wsRouter.wsPostAction(ws, data.params);
								break;
						}
						break;
				}
			} catch (err) {
				console.error(err);
			}
		});
	}

	async wsConnect(ws) {
		this.webSockets.push(ws);
		const credentials = await getCredentials();
		let data = {
			method: 'CONNECT',
			type: 'CONNECT',
			params: {
				settings: {
					apiKey: credentials.youtube.apiKey,
					twitchAccounts: [credentials.twitch.streamer.name, credentials.twitch.bot.name]
				}
			}
		};

		if (!send(ws, data)) {
			await this.clearDisconnectedUsers();
		}
	}

	async wsGetMessages(ws, params) {
		let count = 50;
		let index = (await services.db.twitch_messages.countMessages()) - 1;
		if (params != null && params.count != null) {
			count = params.count;
		}
		if (params != null && params.index != null) {
			index = Math.min(params.index, index);
		}

		if (index < 0) {
			return false;
		}

		let messages = [];
		for (let i = index; i > index - count && i >= 0; i--) {
			const messageObject = await services.db.twitch_messages.getMessageByIndex(i);
			if (!messageObject.message.twitchID) {
				console.log(messageObject);
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
	}

	async wsGetViewer(ws, params) {}

	async wsPostMessages(ws, params) {
		const { author, message } = params;
		switch (author.toLowerCase()) {
			case services.streamer.client.username:
				services.streamer.client.say(services.streamer.channels[0].substring(1), message);
				break;
			case services.bot.client.username:
				services.bot.client.say(services.bot.channels[0].substring(1), message);
				break;
		}
	}

	async wsPostAction(ws, params) {
		if (params.platform === 'twitch') {
			if (!services.streamer.actions.has(params.action)) {
				console.error(`No Action named <${params.action}>!`);
				return;
			}
			let result = await services.streamer.actions.get(params.action)(params);
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
	}

	async wsAddViewer(viewer) {
		// TODO add viewer to viewer list and send whole list to all websockets
	}

	async wsRemoveViewer(viewer) {
		// TODO remove viewer from viewer list and send whole list to all websockets
	}

	async wsAddMessage(message) {
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
	}

	async wsAddEvent(event) {
		// TODO split into params based on event
	}

	async clearDisconnectedUsers() {
		for (let i = 0; i < this.webSockets.length; i) {
			if (this.webSockets[i].readyState !== 1) {
				this.webSockets.splice(i, 1);
			} else {
				i++;
			}
		}
	}

	async wsGetUserInformation(ws, params) {
		let user = await services.db.users.getUserByID(params.id);
		send(ws, {
			method: 'POST',
			type: 'user-information',
			params: {
				user: user
			}
		});
	}
}
