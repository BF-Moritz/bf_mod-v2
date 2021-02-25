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

		services.bot.eventsHandler.channel?.send({
			event: 'cheer',
			group: 'cheer',
			channel,
			userstate,
			message
		});
	},
	clients: ['bf_mod']
};
