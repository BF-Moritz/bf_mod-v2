import express from 'express';

export class ActivityRouter {
	constructor() {
		this.router = express.Router();

		this.router.get('/', (req, res) => {
			res.render('activity/activity');
		});
	}
}
