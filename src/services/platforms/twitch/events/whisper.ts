import { ChatUserstate } from 'tmi.js';
import { services } from '../../../../app.js';

export default {
	run: async (from: string, userstate: ChatUserstate, message: string, self: boolean) => {
		services.logger.debug('whisper', from, userstate, message, self);
		// TODO Discord Authentification
		if (message.startsWith('link-discord') && userstate['user-id'] !== undefined) {
			const authToken = await services.dcbot.createAuthToken(userstate['user-id']);
			if (authToken !== null) {
				services.bot.client.whisper(from, authToken);
			}
		}
	},
	clients: ['bf_mod']
};
