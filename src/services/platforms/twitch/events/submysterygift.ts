import { SubMethods, SubMysteryGiftUserstate } from 'tmi.js';
import { services } from '../../../../app';

export default {
	run: async (
		channel: string,
		username: string,
		numbOfSubs: number,
		methods: SubMethods,
		userstate: SubMysteryGiftUserstate
	) => {
		if (!services.initialized) {
			return;
		}

		// TODO Log in Discord
		// TODO Send to Webinterface
		// TODO Trigger Alert
	},
	clients: ['bf_mod']
};
