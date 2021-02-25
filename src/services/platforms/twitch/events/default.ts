// Just for reference

import { services } from '../../../../app';

export default {
	run: async () => {
		if (!services.initialized) {
			return;
		}
	},
	clients: ['bf_mod']
};
