import Joi from 'joi';
import { ICollection, IMonkManager, InsertResult } from 'monk';
import { ActivityInterface, ActivityObjectInterface } from '../../interfaces/activities';
import { CredentialsInterface } from '../../interfaces/config/credentials';

const activitySchema = Joi.object({
	channel: Joi.string().required(),
	type: Joi.string().required(),
	activity: Joi.object(),
	seen: Joi.boolean(),
	index: Joi.number(),
	date: Joi.date()
});

export class TwitchActivitiesDB {
	db: ICollection;

	constructor(db: IMonkManager, credentials: CredentialsInterface) {
		this.db = db.get(credentials.dbs.twitch_activities.name);
	}

	async addActivity(
		channel: string,
		type: string,
		activity: ActivityInterface
	): Promise<InsertResult<ActivityObjectInterface> | null> {
		try {
			const activityObject: ActivityObjectInterface = {
				channel: channel,
				type: type,
				activity: activity,
				seen: false,
				index: (await this.countActivities()) || -1,
				date: new Date(Date.now())
			};
			const { value } = await activitySchema.validate(activityObject);
			return await this.db.insert(value);
		} catch (err) {
			console.error(err);
			return null;
		}
	}

	async getAllActivities() {
		try {
			return await this.db.find({});
		} catch (err) {
			console.error(err);
			return null;
		}
	}

	async getAllActivitiesByChannel(channel: string): Promise<ActivityObjectInterface[] | null> {
		try {
			const activities = ((await this.db.find({ channel: channel })) as unknown) as
				| ActivityObjectInterface[]
				| null;
			if (!activities) {
				return null;
			}
			return activities;
		} catch (err) {
			console.error(err);
			return null;
		}
	}

	async getActivityByID(id: string): Promise<ActivityObjectInterface | null> {
		try {
			const activity = (await this.db.findOne({ _id: id })) as ActivityObjectInterface | null;
			if (!activity) {
				return null;
			}
			return activity;
		} catch (err) {
			console.error(err);
			return null;
		}
	}

	async getActivityByIndex(index: number): Promise<ActivityObjectInterface | null> {
		try {
			const activity = (await this.db.findOne({ index: index })) as ActivityObjectInterface | null;
			if (!activity) {
				return null;
			}
			return activity;
		} catch (err) {
			console.error(err);
			return null;
		}
	}

	async seeActivity(index: number): Promise<ActivityObjectInterface | null> {
		try {
			const activity = (await this.db.findOne({ index: index })) as ActivityObjectInterface | null;
			if (!activity) {
				return null;
			}
			return ((await this.db.update(
				{ _id: activity['_id'] },
				{ $set: { seen: true } }
			)) as unknown) as ActivityObjectInterface;
		} catch (err) {
			console.error(err);
			return null;
		}
	}

	async countActivities() {
		try {
			return await this.db.count({});
		} catch (err) {
			console.error(err);
			return null;
		}
	}
}
