import { Channel } from 'bf_package-channels/lib';
import { EventsChannelInterface } from '../../../../interfaces/twitch/channels';
import tmi from 'tmi.js';
import { services } from '../../../../app';
import { manageUser } from '../../../../utils/twitch/manageUser';
import { chatMessage, cheerMessage } from '../../../../utils/twitch/messages';
import { executeCommands } from '../../../../utils/twitch/executeCommands';

export class EventsHandler {
	channel: Channel | null;
	constructor(channelInterval: number) {
		this.channel = new Channel(channelInterval);
	}

	async handle() {
		for await (const rec of this.channel?.receive()) {
			const event = rec as EventsChannelInterface;
			switch (event.group) {
				case 'message':
					await this.handleMessage(event);
					break;
				case 'cheer':
					await this.handleCheer(event);
					break;
				case 'sub':
					await this.handleSub(event);
					break;
				case 'mod':
					await this.handleMod(event);
					break;
				case 'chat':
					await this.handleChat(event);
					break;
				case 'host':
					await this.handleHost(event);
					break;
				case 'channel':
					await this.handleChannel(event);
					break;
				case 'points':
					await this.handlePoints(event);
					break;
				case 'pm':
					await this.handlePM(event);
					break;
				case 'connection':
					await this.handleConnection(event);
					break;
				default:
					console.log('missing handler', event);
					break;
			}
		}
	}

	async handleMessage(event: EventsChannelInterface) {
		if (['message'].includes(event.event as string)) return;
		const channel: string = event.channel;
		const userstate: tmi.Userstate = event.userstate;
		const message: string = event.message;
		const self: boolean = event.self;

		let missingUserID: boolean = false;

		// Insert missing user-id for Bot
		if (!userstate['user-id']) {
			missingUserID = true;
			if (self) {
				const botAccount = await services.db.users.getUserByTwitchName(services.bot.name);
				if (!botAccount) return;
				userstate['user-id'] = botAccount.twitch?.id;
			} else {
				console.error('missing user id', userstate);
				return;
			}
		}

		// check or create user in db
		if (channel.substring(1) === services.streamer.name && !missingUserID) {
			await manageUser(userstate);
		}

		// add message to db
		const messageObject = await services.db.twitchMessages.addMessage(
			channel,
			event.event,
			await chatMessage(userstate, message)
		);

		// add user object to message object
		messageObject.user = await services.db.users.getUserByTwitchID(messageObject.message.twitchID);
		// send message to ws
		await services.api.wsRouter.wsAddMessage(messageObject);

		// log message to DC
		if (channel.substring(1) === services.streamer.name) {
			let action;
			switch (event.event) {
				case 'chat':
					action = services.dcbot.actions.get('twitchLogMessage');
					break;
				case 'action':
					action = services.dcbot.actions.get('twitchLogAction');
					break;
				case 'chat':
					action = services.dcbot.actions.get('twitchLogMessage');
					break;
			}
			if (action !== undefined) {
				await action(messageObject);
			}
		}

		if (self) {
			return;
		}

		await executeCommands(messageObject, channel);
	}

	async handleCheer(event: EventsChannelInterface) {
		const channel: string = event.channel;
		const userstate: tmi.Userstate = event.userstate;
		const message: string = event.message;

		// Insert missing user-id for Bot
		if (!userstate['user-id']) {
			console.error('missing user id', userstate);
			return;
		}

		await manageUser(userstate);
		const messageObject = await services.db.twitchMessages.addMessage(
			channel,
			'cheer',
			await cheerMessage(userstate, message)
		);

		messageObject.user = await services.db.users.getUserByTwitchID(messageObject.message.twitchID);
		await services.api.wsRouter.wsAddMessage(messageObject);

		const action = services.dcbot.actions.get('twitchLogCheer');
		if (action !== undefined) {
			await action(messageObject);
		}
	}

	async handleSub(event: EventsChannelInterface) {
		services.logger.debug('handler', event);
	}

	async handleMod(event: EventsChannelInterface) {
		services.logger.debug('handler', event);
		switch (event.event) {
			case 'automod':
				// API call
				break;
			case 'ban':
			case 'timeout':
				// message
				// API call
				// user updaten
				break;
			case 'mod':
			case 'unmod':
				// user updaten
				break;

			default:
				break;
		}
	}

	async handleChat(event: EventsChannelInterface) {
		services.logger.debug('handler', event);
	}

	async handleHost(event: EventsChannelInterface) {
		services.logger.debug('handler', event);
	}

	async handleChannel(event: EventsChannelInterface) {
		services.logger.debug('handler', event);
	}

	async handlePoints(event: EventsChannelInterface) {
		services.logger.debug('handler', event);
	}

	async handleConnection(event: EventsChannelInterface) {
		switch (event.event) {
			case 'connected':
			case 'connecting':
				const address = event.address as string;
				const port = event.port as number;
				break;
			case 'disconnected':
				const reason = event.reason as string;
				break;
			case 'disconnected':
			case 'reconnect':
			case 'ping':
				break;
			case 'pong':
				const latency = event.latency as number;
				services.bot.latency = Math.floor(latency * 1000);
				break;
			case 'serverchange':
				const channel = event.channel as string;
				break;
			default:
				break;
		}
	}

	async handlePM(event: EventsChannelInterface) {
		const from = event.from as string;
		const userstate = event.userstate as tmi.ChatUserstate;
		const message = event.message as string;
		const self = event.self as boolean;

		if (message.startsWith('link-discord') && userstate['user-id'] !== undefined) {
			const authToken = await services.dcbot.createAuthToken(userstate['user-id']);
			if (authToken !== null) {
				services.bot.client.whisper(from, authToken);
			}
		}
	}
}
