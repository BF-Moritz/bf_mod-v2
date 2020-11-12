import fetch from 'node-fetch';
import request from 'request';
import { getCredentials } from '../../../../config/credentials/credentialsConfig.js';

export async function getTwitchLogo(userID) {
	let credentials = await getCredentials();
	request.get(
		'https://api.twitch.tv/kraken/users/' + userID,
		{
			headers: {
				Accept: 'application/vnd.twitchtv.v5+json',
				'Client-ID': credentials.twitch.bot.clientID
			}
		},
		(err, res, body) => {
			return JSON.parse(body).logo;
		}
	);
}

export async function getTwitchInfoFromUsername(username) {
	let credentials = await getCredentials();
	let res = null;
	let response = await fetch('https://api.twitch.tv/kraken/users?login=' + username, {
		headers: {
			Accept: 'application/vnd.twitchtv.v5+json',
			'Client-ID': credentials.twitch.bot.clientID
		}
	});
	let responseData = await response.json();
	if (responseData['_total'] === 1) {
		responseData = responseData.users[0];
		res = {
			displayName: responseData['display_name'],
			id: responseData['_id'],
			bio: responseData.bio,
			createdAt: responseData['created_at'],
			logo: responseData.logo
		};
	}
	return res;
}
