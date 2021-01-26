import { NextFunction, Request, Response } from 'express';

export function notFound(req: Request, res: Response, next: NextFunction) {
	const error = new Error(`Not found - ${req.originalUrl}`);
	res.status(404);
	next(error);
}

export function errorHandler(error: Error, req: Request, res: Response, next: NextFunction) {
	const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
	res.json({
		status: statusCode,
		message: error.message
	});
}
