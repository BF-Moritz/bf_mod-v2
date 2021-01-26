import express from 'express';
import { getCredentials, setCredentials } from '../../config/credentials/credentialsConfig';
import request, { Response } from 'request';

import fetch from 'node-fetch';

export class AuthRouter {
	router: express.Router;

	constructor() {
		this.router = express.Router();

		this.router.get('/', async (req, res) => {
			const credentials = await getCredentials();
			res.render('auth/auth', {
				twitchURL: `https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=${
					credentials.twitch.bot.clientID
				}&redirect_uri=http://localhost:5000/views/auth/twitch&scope=${credentials.twitch.bot.scopes.join(
					' '
				)}`,
				spotifyURL: `https://accounts.spotify.com/authorize?response_type=code&client_id=${
					credentials.spotify.clientID
				}&scope=${credentials.spotify.scopes.join(' ')}&redirect_uri=http://localhost:5000/views/auth/spotify`
			});
		});

		this.router.get('/twitch', async (req, res) => {
			if (req.query.code) {
				const credentials = await getCredentials();
				const url = `https://id.twitch.tv/oauth2/token?client_id=${credentials.twitch.bot.clientID}&client_secret=${credentials.twitch.bot.secret}&code=${req.query.code}&grant_type=authorization_code&redirect_uri=http://localhost:5000/views/auth/twitch`;

				const response = await fetch(url, {
					method: 'post'
				});
				const { access_token, expires_in, refresh_token } = await response.json();
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

		this.router.get('/spotify', async (req, res) => {
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
							redirect_uri: 'http://localhost:5000/views/auth/spotify'
						},
						headers: {
							Authorization: `Basic ${authBuffer.toString('base64')}`
						}
					},
					async (req: any, res: Response, body: any) => {
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
	}
}
