import express from 'express';
import expressWS from 'express-ws';
import {getCredentials} from '../config/credentials/credentialsConfig.js';
import {APIRouter} from './apiRouter.js';
import {ViewsRouter} from './viewsRouter.js';
import {WSRouter} from './wsRouter.js';

export class API {
	constructor() {
		this.api = express();
		expressWS(this.api);
		this.apiRouter = new APIRouter();
		this.wsRouter = new WSRouter();
		this.viewsRouter = new ViewsRouter(this.api);
	}
	
	async initialize() {
		let credentials = await getCredentials();
		this.api.listen(credentials.api.port, () => {
			console.log(`API started on port ${credentials.api.port}`);
		});
		this.api.use(credentials.api.api.path, this.apiRouter.router);
		this.api.ws(credentials.api.ws.path, this.wsRouter.router);
		this.api.use(credentials.api.views.path, this.viewsRouter.router);
	}
}