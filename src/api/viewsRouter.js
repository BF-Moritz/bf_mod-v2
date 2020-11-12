import express from 'express';
import path from 'path';
import {ActivityRouter} from './viewsRouter/activityRouter.js';
import {AlertsRouter} from './viewsRouter/alertsRouter.js';
import {ChatRouter} from './viewsRouter/chatRouter.js';
import {OverlayRouter} from './viewsRouter/overlayRouter.js';

export class ViewsRouter {
	constructor(api) {
		this.router = express.Router();
		const __dirname = path.resolve('./src/api/');
		api.set('views', __dirname + '/views');
		api.set('view engine', 'pug');
		api.use(express.static(__dirname + '/public'));
		
		this.chatRouter = new ChatRouter();
		this.overlaysRouter = new OverlayRouter();
		this.alertsRouter = new AlertsRouter();
		this.activityRouter = new ActivityRouter();
		
		// Homepage
		this.router.get('/', (req, res) => {
			res.render('index/index');
		});
		
		// Chat Interface
		this.router.use('/chat', this.chatRouter.router);
		
		// Overlays
		this.router.use('/overlays', this.overlaysRouter.router);
		
		// Alerts
		this.router.use('/alerts', this.alertsRouter.router);
		
		// Activity Feed
		this.router.use('/activity', this.activityRouter.router);
	}
}