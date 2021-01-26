import { services } from '../../../../../app';
import { getCredentials } from '../../../../../config/credentials/credentialsConfig';

import fetch from 'node-fetch';
import { refreshClientAuthToken } from './refreshClientAuthToken';

export default class CustomRewards {
	customRewards: any; //TODO
	constructor() {
		this.customRewards;
	}

	async updateList(isNested = false) {
		const credentials = await getCredentials();

		const url = new URL('https://api.twitch.tv/helix/channel_points/custom_rewards');
		url.searchParams.append('broadcaster_id', credentials.twitch.streamer.id);
		const response = await fetch(url, {
			method: 'get',
			headers: {
				Authorization: 'Bearer ' + credentials.twitch.bot.clientAccesToken,
				'Client-ID': credentials.twitch.bot.clientID
			}
		});

		const json = await response.json();
		if (json.status && json.status > 400) {
			services.logger.error(json);
			if (isNested) {
				return;
			}
			await refreshClientAuthToken();
			await this.updateList(true);
		} else {
			this.customRewards = json.data;
		}
	}
}
