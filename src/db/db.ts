import monk, { IMonkManager } from 'monk';
import { CredentialsInterface } from '../interfaces/config/credentials';
import { TwitchActivitiesDB } from './twitch-activities/db';

import { TwitchMessagesDB } from './twitch-messages/db';
import { UsersDB } from './users/db';

export class DB {
	db: IMonkManager;
	twitchMessages: TwitchMessagesDB;
	users: UsersDB;
	activities: TwitchActivitiesDB;

	constructor(credentials: CredentialsInterface) {
		this.db = monk(credentials.dbs.mongo_uri, {
			authSource: 'admin'
		});
		this.twitchMessages = new TwitchMessagesDB(this.db, credentials);
		this.users = new UsersDB(this.db, credentials);
		this.activities = new TwitchActivitiesDB(this.db, credentials);
	}
}
