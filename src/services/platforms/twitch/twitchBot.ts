import { RoomState } from 'tmi.js';
import { CredentialsInterface } from '../../../interfaces/config/credentials';
import Authentificator from './api/helix/authentificator';
import CustomRewards from './api/helix/customRewards';
import Streaminfo from './api/helix/streaminfo';
import { Twitch } from './twitch';

export class TwitchBot extends Twitch {
	latency: number;
	state: RoomState;
	helixAuthentificator: Authentificator;
	streaminfo: Streaminfo;
	customRewards: CustomRewards;

	constructor(account: 'bot' | 'streamer', credentials: CredentialsInterface) {
		super(account, credentials);
		this.latency = 0;
		this.state = {};
		this.helixAuthentificator = new Authentificator();
		this.helixAuthentificator.start();

		this.streaminfo = new Streaminfo();
		this.streaminfo.start();

		this.customRewards = new CustomRewards();
		this.customRewards.updateList();
	}
}
