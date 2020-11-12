import Joi from 'joi';

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
		createdAt: Joi.date().required()
	}),
	discord: Joi.object({
		name: Joi.string().required(),
		id: Joi.number().required(),
		roles: Joi.array()
	}),
	points: Joi.number().default(0)
});

export class UsersDB {
	constructor(db, credentials) {
		try {
			this.db = db.get(credentials.dbs.users.name);
		} catch (err) {
			console.error(err);
		}
	}

	async addUser(twitch, discord) {
		try {
			let newUser = {};
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

	async getUserByID(id) {
		try {
			const user = await this.db.findOne({
				_id: id
			});
			if (!user) {
				return null;
			}
			return user;
		} catch (err) {
			console.error(err);
			return null;
		}
	}

	async getUserByTwitchID(id) {
		try {
			const user = await this.db.findOne({ 'twitch.id': id.toString() });
			if (!user) {
				return null;
			}
			return user;
		} catch (err) {
			console.error(err);
			return null;
		}
	}

	async getUserByDiscordID(id) {
		try {
			const user = await this.db.findOne({ 'discord.id': id.toString() });
			if (!user) {
				return null;
			}
			return user;
		} catch (err) {
			console.error(err);
			return null;
		}
	}

	async updateUser(updateUser) {
		try {
			const user = await this.db.findOne({ _id: updateUser['_id'] });
			if (!user) {
				return null;
			}
			return await this.db.update({ _id: updateUser['_id'] }, { $set: updateUser });
		} catch (err) {
			console.error(err);
			return null;
		}
	}

	async deleteUser(id) {
		try {
			await this.db.remove({ _id: id });
			return true;
		} catch (err) {
			console.error(err);
			return null;
		}
	}
}
