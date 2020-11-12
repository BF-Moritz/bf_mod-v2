import express from 'express';

export class APIRouter {
	constructor() {
		this.router = express.Router();
		
		this.router.get('/', (req, res) => {
			res.send('test');
		});
	}
}