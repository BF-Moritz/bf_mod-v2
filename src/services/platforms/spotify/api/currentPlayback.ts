import fetch from 'node-fetch';
import { services } from '../../../../app';
import { getCredentials } from '../../../../config/credentials/credentialsConfig';
import { CurrentlyPlayingInterface } from '../../../../interfaces/spotify/currentlyPlaying.api';

export default class CurrentPlayback {
	interval: NodeJS.Timeout | null;
	timedelta: number;
	info: CurrentlyPlayingInterface | null;

	constructor() {
		this.interval = null;
		this.timedelta = 5 * 1000;
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
					this.info = json as CurrentlyPlayingInterface;

					await services.api.wsRouter.wsUpdateSpotifyPlayback(this.info);
				} else if (response.status === 204) {
					this.info = null;
				} else if (response.status === 401) {
					const err = await services.spotify.refreshToken();

					if (err !== null) {
						services.logger.error('Refresh your Spotify login on: http://localhost:5000/views/auth', err);
					}
				} else {
					services.logger.error('[Spotify] error on getting current Playback:', response);
				}
			}
		}, this.timedelta);
	}

	stop() {
		if (this.interval !== null) clearInterval(this.interval);
		this.interval = null;
	}
}
