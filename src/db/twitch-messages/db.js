import Joi from 'joi';

const messageSchema = Joi.object({
	channel: Joi.string().required(),
	type: Joi.string().required(),
	message: Joi.object(),
	deleted: Joi.boolean(),
	index: Joi.number(),
	date: Joi.date()
});

export class TwitchMessagesDB {
	constructor(db, credentials) {
		this.db = db.get(credentials.dbs.twitch_messages.name);
	}
	
	async addMessage(channel, type, message) {
		try {
			const messageObject = {
				channel: channel,
				type: type,
				message: message,
				deleted: false,
				index: await this.countMessages(),
				date: Date.now()
			};
			const {value} = await messageSchema.validate(messageObject);
			return await this.db.insert(value);
		} catch (err) {
			console.error(err);
			return null;
		}
	}
	
	async getAllMessages() {
		try {
			return await this.db.find({});
		} catch (err) {
			console.error(err);
			return null;
		}
	}
	
	async getAllMessagesByChannel(channel) {
		try {
			const messages = await this.db.find({channel: channel});
			if (!messages) {
				return null;
			}
			return messages;
		} catch (err) {
			console.error(err);
			return null;
		}
	}
	
	async getMessageByIndex(index) {
		try {
			const message = await this.db.findOne({index: index});
			if (!message) {
				return null;
			}
			return message;
		} catch (err) {
			console.error(err);
			return null;
		}
	}
	
	async deleteMessage(index) {
		try {
			const message = await this.db.findOne({index: index});
			if (!message) {
				return null;
			}
			return await this.db.update({'_id': message['_id']}, {deleted: true});
		} catch (err) {
			console.error(err);
			return null;
		}
	}
	
	async countMessages() {
		try {
			return await this.db.count({});
		} catch (err) {
			console.error(err);
			return null;
		}
	}
}
