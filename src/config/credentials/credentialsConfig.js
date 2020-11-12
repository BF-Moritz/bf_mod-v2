import fs from 'fs';

export async function getCredentials() {
	let credentialsData = await fs.readFileSync('./src/config/credentials/credentials.json');
	return JSON.parse(credentialsData);
}

export async function setCredentials(credentials) {
	let error = await fs.writeFileSync(
		'./src/config/credentials/credentials.json',
		JSON.stringify(credentials, null, '  '),
		'utf8'
	);
	return error === null;
}
