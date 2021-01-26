import { services } from '../../../../../app';
import { getCredentials } from '../../../../../config/credentials/credentialsConfig';

import fetch from 'node-fetch';

export default class Streaminfo {
	interval: null | NodeJS.Timeout;
	timedelta: number;
	info: Map<string, any>;

	constructor() {
		this.interval = null;
		this.timedelta = 30 * 1000;
		this.info = new Map();
	}

	async start() {
		if (this.interval !== null) {
			this.stop();
		}

		const credentials = await getCredentials();
		credentials.twitch['bot'].channels.forEach((channel) => {
			this.info.set(channel, {
				isLive: false
			});
		});

		this.interval = setInterval(async () => {
			if (services.bot.helixAuthentificator.appOAuth) {
				const channels = credentials.twitch['bot'].channels;
				const url = new URL('https://api.twitch.tv/helix/streams');
				channels.forEach((channel) => {
					url.searchParams.append('user_login', channel);
				});

				const response = await fetch(url, {
					method: 'get',
					headers: {
						Authorization: 'Bearer ' + services.bot.helixAuthentificator.appOAuth,
						'Client-ID': credentials.twitch.bot.clientID
					}
				});
				const json = await response.json();

				this.info.forEach((_, key) => {
					const data = json.data.find((val: any) => val.user_name.toLowerCase() === key);
					if (data) data.isLive = data.type === 'live';
					this.info.set(key, data ? data : { isLive: false });
				});
			}
		}, this.timedelta);
	}

	stop() {
		if (this.interval) clearInterval(this.interval);
		this.interval = null;
	}
}
