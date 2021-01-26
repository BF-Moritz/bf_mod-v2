import { getCredentials } from '../../../../../config/credentials/credentialsConfig';

import fetch from 'node-fetch';
import { refreshClientAuthToken } from './refreshClientAuthToken';

export default class Authentificator {
	interval: NodeJS.Timeout | null;
	timestamp: number;
	appOAuth: string;
	isAuthenticating: boolean;

	constructor() {
		this.interval = null;
		this.timestamp = 0;
		this.appOAuth = '';
		this.isAuthenticating = false;
	}

	async start() {
		if (this.interval !== null) {
			this.stop();
		}

		const credentials = await getCredentials();

		this.interval = setInterval(async () => {
			if (this.timestamp <= Date.now() && !this.isAuthenticating) {
				this.isAuthenticating = true;

				if (this.appOAuth !== '') {
					const url = new URL('https://id.twitch.tv/oauth2/token');

					url.searchParams.append('client_id', credentials.twitch.bot.clientID);
					url.searchParams.append('client_secret', credentials.twitch.bot.secret);
					url.searchParams.append('grant_type', 'client_credentials');
					url.searchParams.append('scope', credentials.twitch.bot.scopes.join(' '));

					const res = await fetch(url, {
						method: 'post'
					});

					const json = await res.json();
					this.appOAuth = json.access_token;
					this.timestamp = Date.now() + +json.expires_in * 1000;
				} else {
					await refreshClientAuthToken();
				}
				this.isAuthenticating = false;
			}
		}, 1000);
	}

	stop() {
		if (this.interval) clearInterval(this.interval);
		this.interval = null;
	}
}
