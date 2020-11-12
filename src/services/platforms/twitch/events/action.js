import {services} from '../../../../app.js';
import {executeCommands} from '../../../../utils/twitch/executeCommands.js';
import {manageUser} from '../../../../utils/twitch/manageUser.js';
import {chatMessage} from '../../../../utils/twitch/messages.js';

export default {
	run: async (channel, userstate, message, self) => {
		if (!userstate['user-id']) {
			if (self) {
				userstate['user-id'] = services.bot.client.globaluserstate['user-id']
			} else {
				console.error('missing user id', userstate);
				return;
			}
		}
		
		await manageUser(userstate);
		const messageObject = await services.db.twitch_messages.addMessage(channel, 'action', await chatMessage(userstate, message));
		messageObject.user = await services.db.users.getUserByTwitchID(messageObject.message.twitchID);
		await services.api.wsRouter.wsAddMessage(messageObject);
		await services.dcbot.actions.get('twitchLogAction')(messageObject);
		if (self) {
			return;
		}
		await executeCommands(message, userstate['user-id'], channel);
	},
	clients: ['bf_mod']
};
