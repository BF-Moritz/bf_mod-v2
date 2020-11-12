import {services} from '../../../../app.js';
import {sleep} from '../../../../utils/miscellaneous/sleep.js';
import {manageUser} from '../../../../utils/twitch/manageUser.js';
import {chatMessage} from '../../../../utils/twitch/messages.js';
import {executeCommands} from '../../../../utils/twitch/executeCommands.js'

export default {
	run: async (channel, userstate, message, self) => {
		// While not finished initializing
		while (!services.initialized) {
			await sleep(1000);
		}
		
		// Insert missing user-id for Bot
		if (!userstate['user-id']) {
			if (self) {
				userstate['user-id'] = services.bot.client.globaluserstate['user-id']
			} else {
				console.error('missing user id', userstate)
			}
		}
		
		await manageUser(userstate);
		const messageObject = await services.db.twitch_messages.addMessage(channel, 'chat', await chatMessage(userstate, message));
		messageObject.user = await services.db.users.getUserByTwitchID(messageObject.message.twitchID);
		await services.api.wsRouter.wsAddMessage(messageObject);
		await services.dcbot.actions.get('twitchLogMessage')(messageObject);
		if (self) {
			return;
		}
		
		await executeCommands(message, userstate['user-id'], channel);
	},
	clients: ['bf_mod']
};
