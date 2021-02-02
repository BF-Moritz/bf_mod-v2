import express from 'express';
import expressWS from 'express-ws';
import { services } from '../app';
import { getCredentials } from '../config/credentials/credentialsConfig';
import { APIRouter } from './apiRouter';
import { ViewsRouter } from './viewsRouter';
import { WSRouter } from './wsRouter';
import path from 'path';

import { errorHandler, notFound } from './middlewares';
import { CredentialsInterface } from '../interfaces/config/credentials';

export class API {
	api: expressWS.Application;
	apiRouter: APIRouter;
	wsRouter: WSRouter;
	viewsRouter: ViewsRouter;

	constructor() {
		const { app } = expressWS(express());
		this.api = app;
		this.apiRouter = new APIRouter();
		this.wsRouter = new WSRouter();
		this.viewsRouter = new ViewsRouter(this.api);
	}

	initialize = async (credentials: CredentialsInterface) => {
		this.api.use(path.join(credentials.api.api.path, credentials.api.api.version), this.apiRouter.router);
		this.api.ws(credentials.api.ws.path, this.wsRouter.router);
		this.api.use(credentials.api.views.path, this.viewsRouter.router);
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
