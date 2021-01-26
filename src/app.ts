import { getCredentials } from './config/credentials/credentialsConfig';
import { Services } from './services/services';

export let services: Services;

const loggerLevel = 'debug';

async function main() {
	// Initialize Services
	const credentials = await getCredentials();

	services = new Services(loggerLevel, credentials);
	await services.initialize();
}

main();
