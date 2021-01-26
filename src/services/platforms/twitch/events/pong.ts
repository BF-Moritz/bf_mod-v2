import { services } from '../../../../app';

export default {
	run: async (latency: number) => {
		services.bot.latency = Math.floor(latency * 1000);
	},
	clients: ['bf_mod']
};
