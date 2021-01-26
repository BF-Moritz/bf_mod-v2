import { services } from '../../../../app';
import { cheerMessage } from '../../../../utils/twitch/messages';
import tmi from 'tmi.js';
import { manageUser } from '../../../../utils/twitch/manageUser';

export default {
	/**
	 *
	 * @param {string} channel the channel on which was cheered
	 * @param {Userstate} userstate userstate of the author
	 * @param {string} message the unparsed message
	 */
	run: async (channel: string, userstate: tmi.Userstate, message: string) => {
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
		// TODO Trigger Alert
	},
	clients: ['bf_mod']
};
