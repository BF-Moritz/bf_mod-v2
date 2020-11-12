export function actionMessage() {}

export async function chatMessage(userstate, message) {
	let messageObject = {
		id: userstate.id,
		twitchID: userstate['user-id'],
		timestampTMI: userstate['tmi-sent-ts'],
		roomID: userstate['room-id'],
		emotes: userstate.emotes,
		flags: userstate.flags,
		badges: userstate.badges,
		badgeInfo: userstate['badge-info'],
		clientNonce: userstate['client-nonce'],
		type: userstate['message-type'],
		message: message,
		reply: null
	};

	if (userstate.hasOwnProperty('reply-parent-display-name')) {
		messageObject.reply = {};
		messageObject.reply.parentDisplayName = userstate['reply-parent-display-name'];
	}
	if (userstate.hasOwnProperty('reply-parent-msg-body')) {
		messageObject.reply.parentMessageBody = userstate['reply-parent-msg-body'];
	}
	if (userstate.hasOwnProperty('reply-parent-msg-id')) {
		messageObject.reply.parentMessageID = userstate['reply-parent-msg-id'];
	}
	if (userstate.hasOwnProperty('reply-parent-user-id')) {
		messageObject.reply.parentUserID = userstate['reply-parent-user-id'];
	}
	if (userstate.hasOwnProperty('reply-parent-user-login')) {
		messageObject.reply.parentUserName = userstate['reply-parent-user-login'];
	}

	return messageObject;
}

export async function cheerMessage() {}

export async function hostedMessage() {}

export async function hostingMessage() {}

export async function messageMessage() {}

export async function raidedMessage() {}

export async function reSubMessage() {}

export async function subGiftMessage() {}

export async function subMysteryGiftMessage() {}

export async function subscriptionMessage() {}
