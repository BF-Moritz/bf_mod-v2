import { services } from '../../../../app';
import { executeCommands } from '../../../../utils/twitch/executeCommands';
import { manageUser } from '../../../../utils/twitch/manageUser';
import { chatMessage } from '../../../../utils/twitch/messages';
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

		if (!userstate['user-id']) {
			if (self) {
				console.error(services.bot);
				// userstate['user-id'] = services.bot.client.globaluserstate['user-id'];
			} else {
				console.error('missing user id', userstate);
				return;
			}
		}

		await manageUser(userstate);
		const messageObject = await services.db.twitchMessages.addMessage(
			channel,
			'action',
			await chatMessage(userstate, message)
		);

		messageObject.user = await services.db.users.getUserByTwitchID(messageObject.message.twitchID);
		await services.api.wsRouter.wsAddMessage(messageObject);

		const action = services.dcbot.actions.get('twitchLogAction');
		if (action !== undefined) {
			await action(messageObject);
		}

		if (self) {
			return;
		}

		await executeCommands(messageObject, channel);
	},
	clients: ['bf_mod']
};
