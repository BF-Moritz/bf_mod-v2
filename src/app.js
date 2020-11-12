import {Services} from './services/services.js';

export let services;

async function main() {
	// Initialize Services
	services = new Services();
	await services.initialize();
}

main();
