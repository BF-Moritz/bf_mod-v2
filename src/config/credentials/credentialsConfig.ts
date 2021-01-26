import fs from 'fs';
import { CredentialsInterface } from '../../interfaces/config/credentials';

export async function getCredentials(): Promise<CredentialsInterface> {
	let credentialsData = await fs.promises.readFile('./src/config/credentials/credentials.json');
	return JSON.parse(credentialsData.toString()) as CredentialsInterface;
}

export async function setCredentials(credentials: CredentialsInterface): Promise<Boolean> {
	let error = await fs.writeFileSync(
		'./src/config/credentials/credentials.json',
		JSON.stringify(credentials, null, '  '),
		'utf8'
	);
	return error === null;
}
