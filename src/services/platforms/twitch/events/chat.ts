import { services } from '../../../../app';
import { manageUser } from '../../../../utils/twitch/manageUser';
import { chatMessage } from '../../../../utils/twitch/messages';
import { executeCommands } from '../../../../utils/twitch/executeCommands';
import tmi from 'tmi.js';

export default {
	/**
	 *
	 * @param {string} channel the channel on which the message was written
	 * @param {tmi.Userstate} userstate userstate of the author
	 * @param {string} message the unparsed message
	 * @param {boolean} self is the bot
	 */
	run: async (channel: string, userstate: tmi.Userstate, message: string, self: boolean): Promise<void> => {
		if (!services.initialized) {
			return;
		}

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

		if (channel.substring(1) === services.streamer.name && !missingUserID) {
			await manageUser(userstate);
		}

		const messageObject = await services.db.twitchMessages.addMessage(
			channel,
			'chat',
			await chatMessage(userstate, message)
		);

		const user = await services.db.users.getUserByTwitchID(messageObject.message.twitchID);
		messageObject.user = user;
		await services.api.wsRouter.wsAddMessage(messageObject);

		if (channel.substring(1) === services.streamer.name) {
			const action = services.dcbot.actions.get('twitchLogMessage');
			if (action !== undefined) {
				await action(messageObject);
			}
		}

		if (self) {
			return;
		}

		await executeCommands(messageObject, channel);
	},
	clients: ['bf_mod']
};
