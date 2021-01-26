import express, { NextFunction, Request, Response } from 'express';

import userRouter from './routes/user/user.router';

export class APIRouter {
	router: express.Router;

	constructor() {
		this.router = express.Router();

		this.router.use('/user', userRouter);

		this.router.get('/', (req: Request, res: Response, next: NextFunction) => {
			res.send('API v1');
		});
	}
}
