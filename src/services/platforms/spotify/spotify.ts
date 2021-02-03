import fetch from 'node-fetch';
import { getCredentials } from '../../../config/credentials/credentialsConfig';
import { sleep } from '../../../utils/miscellaneous/sleep';
import CurrentPlayback from './api/currentPlayback';

export class Spotify {
	streamInfo: CurrentPlayback;
	isRefreshing: boolean;

	constructor() {
		this.streamInfo = new CurrentPlayback();
		this.streamInfo.start();
		this.isRefreshing = false;
	}

	async refreshToken(): Promise<Error | null> {
		this.isRefreshing = true;
		let credentials = await getCredentials();

		const authBuffer = Buffer.from(`${credentials.spotify.clientID}:${credentials.spotify.secret}`, 'utf8');
		const formData = new URLSearchParams();
		formData.append('grant_type', 'refresh_token');
		formData.append('refresh_token', credentials.spotify.refresh_token);

		let response = await fetch('https://accounts.spotify.com/api/token', {
			method: 'post',
			body: formData,
			headers: {
				Authorization: `Basic ${authBuffer.toString('base64')}`
			}
		});

		while (response.status === 503) {
			await sleep(5000);
			response = await fetch('https://accounts.spotify.com/api/token', {
				method: 'post',
				body: formData,
				headers: {
					Authorization: `Basic ${authBuffer.toString('base64')}`
				}
			});
		}

		if (response.status !== 200) {
			return new Error(`${response.statusText}, ${response.status}`);
		}

		const { access_token, token_type, expires_in, scope } = await response.json();
		credentials = await getCredentials();
		credentials.spotify.accessToken = access_token;
		credentials.spotify.tokenType = token_type;
		credentials.spotify.expiresIn = expires_in;
		credentials.spotify.scopes = scope.split(' ');
		this.isRefreshing = false;
		return null;
	}
}
