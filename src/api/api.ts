import express from 'express';
import expressWS from 'express-ws';
import { services } from '../app';
import { APIRouter } from './apiRouter';
import { WSRouter } from './wsRouter';
import path from 'path';
import cors from 'cors';

import { errorHandler, notFound } from './middlewares';
import { CredentialsInterface } from '../interfaces/config/credentials';

export class API {
	api: expressWS.Application;
	apiRouter: APIRouter;
	wsRouter: WSRouter;

	constructor() {
		const { app } = expressWS(express());
		this.api = app;
		this.apiRouter = new APIRouter();
		this.wsRouter = new WSRouter();
	}

	initialize = async (credentials: CredentialsInterface) => {
		this.api.use(cors());
		this.api.use(path.join(credentials.api.api.path, credentials.api.api.version), this.apiRouter.router);
		this.api.ws(credentials.api.ws.path, this.wsRouter.router);
		this.api.use(notFound);
		this.api.use(errorHandler);
		await new Promise((resolve: Function) => {
			this.api.listen(credentials.api.port, () => {
				services.logger.info(`[API] started on port ${credentials.api.port}`);
				resolve();
			});
		});
	};
}
