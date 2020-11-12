import { services } from '../../../../app.js';

export default {
	run: async (channel, username, self) => {
		// TODO get id from username
		const id = username;
		await services.addTwitchViewer(id);
	},
	clients: ['bf_mod']
};
