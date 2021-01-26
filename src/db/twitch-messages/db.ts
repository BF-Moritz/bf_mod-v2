import Joi from 'joi';
import { ICollection, IMonkManager } from 'monk';
import { CredentialsInterface } from '../../interfaces/config/credentials';
import { MessageObjectInterface } from '../../interfaces/message';
import { sleep } from '../../utils/miscellaneous/sleep';

const messageSchema = Joi.object({
	channel: Joi.string().required(),
	type: Joi.string().required(),
	message: Joi.object(),
	deleted: Joi.boolean(),
	index: Joi.number(),
	date: Joi.date()
});

export class TwitchMessagesDB {
	db: ICollection;
	addingMessage: boolean;

	constructor(db: IMonkManager, credentials: CredentialsInterface) {
		this.db = db.get(credentials.dbs.twitchMessages.name);
		this.addingMessage = false;
	}

	async addMessage(channel: string, type: string, message: MessageObjectInterface) {
		while (this.addingMessage) {
			await sleep(1);
		}
		try {
			this.addingMessage = true;
			const messageObject = {
				channel: channel,
				type: type,
				message: message,
				deleted: false,
				index: await this.countMessages(),
				date: Date.now()
			};

			const { value } = await messageSchema.validate(messageObject);

			const val = await this.db.insert(value);
			this.addingMessage = false;
			return val;
		} catch (err) {
			console.error(err);
			this.addingMessage = false;
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

	async getAllMessagesByChannel(channel: string) {
		try {
			const messages = await this.db.find({ channel: channel });
			if (!messages) {
				return null;
			}
			return messages;
		} catch (err) {
			console.error(err);
			return null;
		}
	}

	async getMessageByID(id: string) {
		try {
			const message = await this.db.findOne({ _id: id });
			if (!message) {
				return null;
			}
			return message;
		} catch (err) {
			console.error(err);
			return null;
		}
	}

	async getMessageByIndex(index: number) {
		try {
			const message = await this.db.findOne({ index: index });
			if (!message) {
				return null;
			}
			return message;
		} catch (err) {
			console.error(err);
			return null;
		}
	}

	async deleteMessage(index: number) {
		try {
			const message = await this.db.findOne({ index: index });
			if (!message) {
				return null;
			}
			return await this.db.update({ _id: message['_id'] }, { $set: { deleted: true } });
		} catch (err) {
			console.error(err);
			return null;
		}
	}

	async countMessages(): Promise<number | null> {
		try {
			return await this.db.count({});
		} catch (err) {
			console.error(err);
			return null;
		}
	}
}
