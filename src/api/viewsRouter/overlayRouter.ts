import express, { Request, Response } from 'express';

export class OverlayRouter {
	router: express.Router;

	constructor() {
		this.router = express.Router();

		this.router.get('/', (req: Request, res: Response) => {
			res.render('overlays/overlays');
		});
	}
}