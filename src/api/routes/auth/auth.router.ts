import express, { NextFunction, Request, Response } from 'express';
import { services } from '../../../app';
import { getCredentials } from '../../../config/credentials/credentialsConfig';

const authRouter = express.Router();

authRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const credentials = await getCredentials();
		const response = [
			{
				name: 'twitch',
				url: `https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=${
					credentials.twitch.bot.clientID
				}&redirect_uri=http://localhost:5000/views/auth/twitch&scope=${credentials.twitch.bot.scopes.join(' ')}`
			},
			{
				name: 'spotify',
				url: `https://accounts.spotify.com/authorize?response_type=code&client_id=${
					credentials.spotify.clientID
				}&scope=${credentials.spotify.scopes.join(' ')}&redirect_uri=http://localhost:5000/views/auth/spotify`
			}
		];
		res.json(response);
	} catch (err) {
		services.logger.error(err);
		next(err);
	}
});

export default authRouter;
