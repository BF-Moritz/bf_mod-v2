import { SubGiftUserstate, SubMethods } from 'tmi.js';
import { services } from '../../../../app';

export default {
	run: async (
		channel: string,
		username: string,
		streakMonths: number,
		recipient: string,
		methods: SubMethods,
		userstate: SubGiftUserstate
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
