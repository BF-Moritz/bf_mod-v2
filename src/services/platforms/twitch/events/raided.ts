import { services } from '../../../../app';

export default {
	run: async (channel: string, username: string, viewers: number) => {
		if (!services.initialized) {
			return;
		}

		// TODO Log in Discord
		// TODO Send to Webinterface
		// TODO Trigger Alert
	},
	clients: ['bf_mod']
};
