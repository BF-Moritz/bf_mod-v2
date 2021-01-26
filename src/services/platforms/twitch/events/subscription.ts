import { SubMethods, SubUserstate } from 'tmi.js';
import { services } from '../../../../app';

export default {
	run: async (channel: string, username: string, method: SubMethods, message: string, userstate: SubUserstate) => {
		if (!services.initialized) {
			return;
		}
		// TODO Log in Discord
		// TODO Send to Webinterface
		// TODO Trigger Alert
	},
	clients: ['bf_mod']
};
