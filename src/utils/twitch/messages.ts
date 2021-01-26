import { parseBadges } from './parseUserstate.js';

import { Userstate } from 'tmi.js';
import { MessageObjectInterface } from '../../interfaces/message.js';

export function actionMessage() {}

export async function chatMessage(userstate: Userstate, message: string): Promise<MessageObjectInterface> {
	let messageObject: MessageObjectInterface = {
		id: userstate.id || '',
		twitchID: userstate['user-id'] || '',
		timestampTMI: userstate['tmi-sent-ts'] || '',
		roomID: userstate['room-id'] || '',
		emotes: userstate.emotes || {},
		flags: userstate.flags || '',
		badges: userstate.badges || {},
		badgeInfo: userstate['badge-info'] || {},
		parsedBadges: parseBadges(userstate['badges-raw'] || ''),
		clientNonce: userstate['client-nonce'],
		type: userstate['message-type'],
		message: message,
		reply: null,
		badgesRaw: userstate['badges-raw'] || '',
		badgesInfoRaw: userstate['badge-info-raw'] || ''
	};

	if (userstate.hasOwnProperty('reply-parent-display-name')) {
		messageObject.reply = {};
		messageObject.reply.parentDisplayName = userstate['reply-parent-display-name'];
	}
	if (userstate.hasOwnProperty('reply-parent-msg-body')) {
		if (messageObject.reply !== null) {
			messageObject.reply.parentMessageBody = userstate['reply-parent-msg-body'];
		}
	}
	if (userstate.hasOwnProperty('reply-parent-msg-id')) {
		if (messageObject.reply !== null) {
			messageObject.reply.parentMessageID = userstate['reply-parent-msg-id'];
		}
	}
	if (userstate.hasOwnProperty('reply-parent-user-id')) {
		if (messageObject.reply !== null) {
			messageObject.reply.parentUserID = userstate['reply-parent-user-id'];
		}
	}
	if (userstate.hasOwnProperty('reply-parent-user-login')) {
		if (messageObject.reply !== null) {
			messageObject.reply.parentUserName = userstate['reply-parent-user-login'];
		}
	}

	return messageObject;
}

export async function cheerMessage(userstate: Userstate, message: string): Promise<MessageObjectInterface> {
	const messageObject: MessageObjectInterface = {
		id: userstate.id || '',
		twitchID: userstate['user-id'] || '',
		timestampTMI: userstate['tmi-sent-ts'] || '',
		roomID: userstate['room-id'] || '',
		emotes: userstate.emotes || {},
		flags: userstate.flags || '',
		badges: userstate.badges || {},
		badgeInfo: userstate['badge-info'] || {},
		parsedBadges: parseBadges(userstate['badges-raw'] || ''),
		clientNonce: userstate['client-nonce'],
		type: userstate['message-type'],
		message: message,
		reply: null,
		bits: userstate.bits,
		badgesRaw: userstate['badges-raw'] || '',
		badgesInfoRaw: userstate['badge-info-raw'] || ''
	};

	return messageObject;
}

export async function hostedMessage() {}

export async function hostingMessage() {}

export async function messageMessage() {}

export async function raidedMessage() {}

export async function reSubMessage() {}

export async function subGiftMessage() {}

export async function subMysteryGiftMessage() {}

export async function subscriptionMessage() {}
