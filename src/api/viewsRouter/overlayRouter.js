import express from 'express';

export class OverlayRouter {
	constructor() {
		this.router = express.Router();
		
		this.router.get('/', (req, res) => {
			res.render('overlays/overlays');
		});
	}
}