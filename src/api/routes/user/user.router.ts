import express, { NextFunction, Request, Response } from 'express';
import { services } from '../../../app';

const userRouter = express.Router();

userRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const users = await services.db.users.getAllUsers();
		res.json(users);
	} catch (err) {
		services.logger.error(err);
		next(err);
	}
});

export default userRouter;
