import Joi from 'joi';
import { ICollection, IMonkManager, InsertResult } from 'monk';
import { CredentialsInterface } from '../../interfaces/config/credentials';
import { UserDiscordInterface, UserInterface, UserTwitchInterface } from '../../interfaces/user';

const userSchema = Joi.object({
	twitch: Joi.object({
		name: Joi.string().required(),
		displayName: Joi.string().required(),
		id: Joi.number().required(),
		broadcaster: Joi.boolean().required(),
		mod: Joi.boolean().required(),
		vip: Joi.boolean().required(),
		sub: Joi.boolean().required(),
		subCount: Joi.number().default(0),
		subTier: Joi.number().default(0),
		color: Joi.string(),
		image: Joi.string().uri(),
		createdAt: Joi.date().required(),
		banned: Joi.boolean().required(),
		timeouted: Joi.boolean().required(),
		timeoutTime: Joi.date().required()
	}),
	discord: Joi.object({
		name: Joi.string().required(),
		id: Joi.number().required(),
		roles: Joi.array()
	}),
	points: Joi.number().default(0)
});

export class UsersDB {
	db: ICollection;

	constructor(db: IMonkManager, credentials: CredentialsInterface) {
		this.db = db.get(credentials.dbs.users.name);
	}

	async getAllUsers(): Promise<UserInterface[] | null> {
		try {
			return (await this.db.find()) as UserInterface[];
		} catch (err) {
			console.error(err);
			return null;
		}
	}

	async addUser(
		twitch: UserTwitchInterface | null,
		discord: UserDiscordInterface | null
	): Promise<InsertResult<UserInterface> | null> {
		try {
			let newUser: UserInterface = {};
			if (twitch !== null && twitch !== undefined) {
				newUser.twitch = twitch;
			}
			if (discord !== null && discord !== undefined) {
				newUser.discord = discord;
			}
			const { value } = await userSchema.validate(newUser);
			return await this.db.insert(value);
		} catch (err) {
			console.error(err);
			return null;
		}
	}

	async getUserByID(id: string): Promise<UserInterface | null> {
		try {
			const user = (await this.db.findOne({
				_id: id
			})) as UserInterface | undefined;
			if (!user) {
				return null;
			}
			return await this.checkUser(user);
		} catch (err) {
			console.error(err);
			return null;
		}
	}

	async getUserByTwitchID(id: string): Promise<UserInterface | null> {
		try {
			const user = (await this.db.findOne({ 'twitch.id': id })) as UserInterface | undefined;
			if (!user) {
				return null;
			}
			return await this.checkUser(user);
		} catch (err) {
			console.error(err);
			return null;
		}
	}

	async getUserByDiscordID(id: string): Promise<UserInterface | null> {
		try {
			const user = (await this.db.findOne({ 'discord.id': id })) as UserInterface | undefined;
			if (!user) {
				return null;
			}
			return await this.checkUser(user);
		} catch (err) {
			console.error(err);
			return null;
		}
	}

	async updateUser(updateUser: UserInterface): Promise<UserInterface | null> {
		try {
			const user = await this.db.findOne({ _id: updateUser['_id'] });
			if (!user) {
				return null;
			}
			await this.checkUser(user);
			return (await this.db.update({ _id: updateUser['_id'] }, { $set: updateUser })) as UserInterface;
		} catch (err) {
			console.error(err);
			return null;
		}
	}

	async deleteUser(id: string): Promise<boolean> {
		try {
			await this.db.remove({ _id: id });
			return true;
		} catch (err) {
			console.error(err);
			return false;
		}
	}

	async checkUser(user: UserInterface): Promise<UserInterface> {
		if (user.twitch !== null && user.twitch !== undefined) {
			if (user.twitch.timeouted) {
				if (user.twitch.timeoutTime < Date.now()) {
					user.twitch.timeouted = false;
					await this.db.update({ _id: user['_id'] }, { $set: user });
				}
			}
		}
		return user;
	}
}
