import express, { Request, Response } from 'express';

export class ActivityRouter {
	router: express.Router;

	constructor() {
		this.router = express.Router();

		this.router.get('/', (req: Request, res: Response) => {
			res.render('activity/activity');
		});
	}
}
