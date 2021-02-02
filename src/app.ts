import { getCredentials } from './config/credentials/credentialsConfig';
import { Services } from './services/services';
import { LoggerLevelType } from './types/logger';

export let services: Services;

const loggerLevel: LoggerLevelType = 'debug';

async function main(): Promise<void> {
	// Initialize Services
	const credentials = await getCredentials();

	services = new Services(loggerLevel, credentials);
	await services.initialize(credentials);
}

main();
