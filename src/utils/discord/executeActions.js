import { services } from '../../app.js';

export async function executeActions(name, params) {
	if (services.dcbot.actions.has(name)) {
		await services.dcbot.actions.get(name)(params);
	}
}
