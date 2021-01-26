import { services } from '../../../../app';

export default {
	run: async (channel: string, username: string, self: boolean) => {
		// TODO get id from username
		const id = username;
		await services.addTwitchViewer(id);
	},
	clients: ['bf_mod']
};
