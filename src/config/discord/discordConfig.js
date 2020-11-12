import fs from 'fs';

export async function getDiscordActions() {
	let credentialsData = await fs.readFileSync('./src/config/discord/actions.json');
	return JSON.parse(credentialsData);
}

export async function getDiscordCommands() {
	let credentialsData = await fs.readFileSync('./src/config/discord/commands.json');
	return JSON.parse(credentialsData);
}

export async function getDiscordEvents() {
	let credentialsData = await fs.readFileSync('./src/config/discord/events.json');
	return JSON.parse(credentialsData);
}

export async function getDiscordChannels() {
	let credentialsData = await fs.readFileSync('./src/config/discord/channels.json');
	return JSON.parse(credentialsData);
}

export async function getDiscordGeneral() {
	let credentialsData = await fs.readFileSync('./src/config/discord/general.json');
	return JSON.parse(credentialsData);
}

export async function setDiscordActions(credentials) {
	let error = await fs.writeFileSync('./src/config/discord/actions.json', JSON.stringify(credentials, null, '  '), 'utf8');
	return error === null;
}

export async function setDiscordCommands(credentials) {
	let error = await fs.writeFileSync('./src/config/discord/commands.json', JSON.stringify(credentials, null, '  '), 'utf8');
	return error === null;
}

export async function setDiscordEvents(credentials) {
	let error = await fs.writeFileSync('./src/config/discord/events.json', JSON.stringify(credentials, null, '  '), 'utf8');
	return error === null;
}

export async function setDiscordChannels(credentials) {
	let error = await fs.writeFileSync('./src/config/discord/channels.json', JSON.stringify(credentials, null, '  '), 'utf8');
	return error === null;
}

export async function setDiscordGeneral(credentials) {
	let error = await fs.writeFileSync('./src/config/discord/general.json', JSON.stringify(credentials, null, '  '), 'utf8');
	return error === null;
}
