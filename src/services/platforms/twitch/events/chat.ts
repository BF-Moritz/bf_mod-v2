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
	run: async (channel: string, userstate: tmi.Userstate, message: string, self: boolean) => {
		if (!services.initialized) {
			return;
		}

		// Insert missing user-id for Bot
		if (!userstate['user-id']) {
			if (self) {
				console.error(services.bot);
				// userstate['user-id'] = services.bot.client.globaluserstate['user-id'];
			} else {
				console.error('missing user id', userstate);
				return;
			}
		}

		if (channel.substring(1) === services.streamer.name) {
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
