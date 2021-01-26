import { SubMethods, SubUserstate } from 'tmi.js';
import { services } from '../../../../app';

export default {
	run: async (
		channel: string,
		username: string,
		months: number,
		message: string,
		userstate: SubUserstate,
		methods: SubMethods
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
