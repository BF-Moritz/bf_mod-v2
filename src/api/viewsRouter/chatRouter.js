import express from 'express';

export class ChatRouter {
	constructor() {
		this.router = express.Router();

		this.router.get('/', (req, res) => {
			res.render('chat/chat');
		});
	}
}
