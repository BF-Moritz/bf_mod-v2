import monk from 'monk';

import { TwitchMessagesDB } from './twitch-messages/db.js';
import { UsersDB } from './users/db.js';

export class DB {
	constructor(credentials) {
		this.db = monk(credentials.dbs.mongo_uri);
		this.twitch_messages = new TwitchMessagesDB(this.db, credentials);
		this.users = new UsersDB(this.db, credentials);
	}
}
