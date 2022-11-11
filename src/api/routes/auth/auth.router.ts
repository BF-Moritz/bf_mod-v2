import express from 'express';
import { services } from '../../../app';
import { getCredentials, setCredentials } from '../../../config/credentials/credentialsConfig';
import request, { Response, Request } from 'request';
import fetch from 'node-fetch';

const authRouter = express.Router();

authRouter.get('/', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
	try {
		const credentials = await getCredentials();
		const response = [
			{
				name: 'twitch',
				base_url: 'https://id.twitch.tv/oauth2/authorize',
				url_params: {
					response_type: 'code',
					client_id: credentials.twitch.bot.clientID,
					scope: credentials.twitch.bot.scopes
				},
				redirect: 'redirect_uri',
				url: `https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=${
					credentials.twitch.bot.clientID
				}&redirect_uri=http://localhost:5000/api/v1/auth/twitch&scope=${credentials.twitch.bot.scopes.join(
					' '
				)}`
			},
			{
				name: 'spotify',
				base_url: 'https://accounts.spotify.com/authorize',
				url_params: {
					response_type: 'code',
					client_id: credentials.spotify.clientID,
					scope: credentials.spotify.scopes
				},
				redirect: 'redirect_uri',
				url: `https://accounts.spotify.com/authorize?response_type=code&client_id=${
					credentials.spotify.clientID
				}&scope=${credentials.spotify.scopes.join(' ')}&redirect_uri=http://localhost:5000/api/v1/auth/spotify`
			}
		];
		res.json(response);
	} catch (err) {
		services.logger.error(err);
		next(err);
	}
});

authRouter.get('/twitch', async (req: express.Request, res: express.Response) => {
	if (req.query.code) {
		let credentials = await getCredentials();
		const url = `https://id.twitch.tv/oauth2/token?client_id=${credentials.twitch.bot.clientID}&client_secret=${credentials.twitch.bot.secret}&code=${req.query.code}&grant_type=authorization_code&redirect_uri=http://localhost:5000/api/v1/auth/twitch`;

		const response = await fetch(url, {
			method: 'post'
		});

		const { access_token, expires_in, refresh_token } = await response.json();
		credentials = await getCredentials();
		credentials.twitch.bot.clientAccesToken = access_token;
		credentials.twitch.bot.clientRefreshToken = refresh_token;
		credentials.twitch.bot.clientAccesTokenExpireDate = new Date(Date.now() + (expires_in - 60) * 1000);
		await setCredentials(credentials);
		res.status(200);
		res.json({
			message: 'OK.'
		});
	}
});

authRouter.get('/spotify', async (req: express.Request, res: express.Response) => {
	if (req.query.code) {
		const credentials = await getCredentials();
		const url = `https://accounts.spotify.com/api/token`;
		const authBuffer = Buffer.from(`${credentials.spotify.clientID}:${credentials.spotify.secret}`, 'utf8');

		request.post(
			url,
			{
				form: {
					grant_type: 'authorization_code',
					code: req.query.code,
					redirect_uri: 'http://localhost:5000/api/v1/auth/spotify'
				},
				headers: {
					Authorization: `Basic ${authBuffer.toString('base64')}`
				}
			},
			async (req: Request, res: Response, body: any) => {
				const { access_token, token_type, expires_in, refresh_token, scope } = JSON.parse(body);
				const credentials = await getCredentials();
				credentials.spotify.accessToken = access_token;
				credentials.spotify.tokenType = token_type;
				credentials.spotify.expiresIn = expires_in;
				credentials.spotify.refresh_token = refresh_token;
				credentials.spotify.scopes = scope.split(' ');
				await setCredentials(credentials);
			}
		);
		res.status(200);
		res.json({
			message: 'OK.'
		});
	} else {
		res.status(500);
		res.json({
			message: 'internal Server error'
		});
	}
});

export default authRouter;
