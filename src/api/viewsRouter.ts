import express from 'express';
import path from 'path';
import { ActivityRouter } from './viewsRouter/activityRouter';
import { AlertsRouter } from './viewsRouter/alertsRouter';
import { ChatRouter } from './viewsRouter/chatRouter';
import { OverlayRouter } from './viewsRouter/overlayRouter';
import { AuthRouter } from './viewsRouter/authRouter';
import expressWs from 'express-ws';

export class ViewsRouter {
	router: express.Router;
	chatRouter: ChatRouter;
	overlaysRouter: OverlayRouter;
	alertsRouter: AlertsRouter;
	activityRouter: ActivityRouter;
	authRouter: AuthRouter;

	constructor(api: expressWs.Application) {
		this.router = express.Router();
		const __dirname = path.resolve('./src/api/');
		api.set('views', __dirname + '/views');
		api.set('view engine', 'pug');
		api.use(express.static(__dirname + '/public'));

		this.chatRouter = new ChatRouter();
		this.overlaysRouter = new OverlayRouter();
		this.alertsRouter = new AlertsRouter();
		this.activityRouter = new ActivityRouter();
		this.authRouter = new AuthRouter();

		// Homepage
		this.router.get('/', (req, res, next) => {
			res.render('index/index', (err: Error) => {
				next(err);
			});
		});

		// Chat Interface
		this.router.use('/chat', this.chatRouter.router);

		// Overlays
		this.router.use('/overlays', this.overlaysRouter.router);

		// Alerts
		this.router.use('/alerts', this.alertsRouter.router);

		// Activity Feed
		this.router.use('/activity', this.activityRouter.router);

		// Auth
		this.router.use('/auth', this.authRouter.router);
	}
}
