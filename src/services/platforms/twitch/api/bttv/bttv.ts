import axios from 'axios';
import { services } from '../../../../../app';
import { getCredentials } from '../../../../../config/credentials/credentialsConfig';
import { BTTVGlobalEmotesInterface, BTTVUserEmotesInterface } from '../../../../../interfaces/twitch/bttv';

export default class BTTV {
	public globalEmotes: BTTVGlobalEmotesInterface[];
	public userEmotes: null | BTTVUserEmotesInterface;
	private intervalTime: number;
	private interval: null | NodeJS.Timeout;

	constructor() {
		this.globalEmotes = [];
		this.userEmotes = null;
		this.intervalTime = 30 * 60 * 1000;
		this.interval = null;
	}

	fetchData = async () => {
		const credentials = await getCredentials();
		try {
			this.globalEmotes = (await axios.get('https://api.betterttv.net/3/cached/emotes/global')).data;
			this.userEmotes = (
				await axios.get(
					`https://api.betterttv.net/3/users/${credentials.bttv.userID}?limited=false&personal=false`
				)
			).data as BTTVUserEmotesInterface;
		} catch (err) {
			services.logger.error(err);
		}
	};

	async start() {
		if (this.interval !== null) {
			this.stop();
		}

		await this.fetchData();
		this.interval = setInterval(async () => {
			await this.fetchData();
		}, this.intervalTime);
	}

	stop() {
		if (this.interval) clearInterval(this.interval);
		this.interval = null;
	}
}
