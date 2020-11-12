import express from 'express';

export class AlertsRouter {
	constructor() {
		this.router = express.Router();

		this.router.get('/', (req, res) => {
			res.render('alerts/alerts');
		});
	}
}
