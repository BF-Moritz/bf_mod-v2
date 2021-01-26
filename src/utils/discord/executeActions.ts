import { services } from '../../app';

export async function executeActions(name: string, params: any) {
	const fnctn = services.dcbot.actions.get(name);
	if (fnctn) {
		await fnctn(params);
	}
}
