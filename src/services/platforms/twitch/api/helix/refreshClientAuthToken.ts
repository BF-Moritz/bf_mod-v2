import { getCredentials, setCredentials } from '../../../../../config/credentials/credentialsConfig';
import fetch from 'node-fetch';
import { services } from '../../../../../app';

export async function refreshClientAuthToken() {
	const credentials = await getCredentials();
	const url = `https://id.twitch.tv/oauth2/token?grant_type=refresh_token&refresh_token=${encodeURIComponent(
		credentials.twitch.bot.clientRefreshToken
	)}&client_id=${credentials.twitch.bot.clientID}&client_secret=${credentials.twitch.bot.secret}`;

	const response = await fetch(url, {
		method: 'post'
	});
	const json = await response.json();
	if (json.status >= 400) {
		services.logger.info('Refresh your Twitch login on: http://localhost:5000/views/auth');
	} else {
		const { access_token, expires_in, refresh_token } = json;
		credentials.twitch.bot.clientAccesToken = access_token;
		credentials.twitch.bot.clientRefreshToken = refresh_token;
		credentials.twitch.bot.clientAccesTokenExpireDate = new Date(Date.now() + (expires_in - 60) * 1000);
		await setCredentials(credentials);
	}
	return;
}
