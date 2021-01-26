import fetch from 'node-fetch';
import { getCredentials } from '../../../../config/credentials/credentialsConfig';

export default class CurrentPlayback {
	interval: NodeJS.Timeout | null;
	timedelta: number;
	info: any; // TODO

	constructor() {
		this.interval = null;
		this.timedelta = 10 * 1000;
		this.info = null;
	}

	async start() {
		if (this.interval !== null) {
			this.stop();
		}

		this.interval = setInterval(async () => {
			const credentials = await getCredentials();

			if (credentials.spotify.accessToken) {
				const url = new URL('https://api.spotify.com/v1/me/player/currently-playing');
				url.searchParams.append('market', credentials.spotify.market);

				const response = await fetch(url, {
					method: 'get',
					headers: {
						Authorization: `${credentials.spotify.tokenType} ${credentials.spotify.accessToken}`
					}
				});

				if (response.status === 200) {
					const json = await response.json();
					this.info = json;
				} else {
					this.info = null;
				}
			}
		}, this.timedelta);
	}

	stop() {
		if (this.interval !== null) clearInterval(this.interval);
		this.interval = null;
	}
}
