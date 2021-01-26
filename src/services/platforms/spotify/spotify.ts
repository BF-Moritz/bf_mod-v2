import CurrentPlayback from './api/currentPlayback';

export class Spotify {
	streamInfo: CurrentPlayback;

	constructor() {
		this.streamInfo = new CurrentPlayback();
		this.streamInfo.start();
	}
}
