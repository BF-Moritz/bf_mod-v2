import fs from 'fs';

export async function getTwitchActions() {
	let actionsData = await fs.readFileSync('./src/config/twitch/actions.json');
	return JSON.parse(actionsData);
}

export async function getTwitchCommands() {
	let commandsData = await fs.readFileSync('./src/config/twitch/commands.json');
	return JSON.parse(commandsData);
}

export async function getTwitchEvents() {
	let eventsData = await fs.readFileSync('./src/config/twitch/events.json');
	return JSON.parse(eventsData);
}

export async function getTwitchGeneral() {
	let generalData = await fs.readFileSync('./src/config/twitch/general.json');
	return JSON.parse(generalData);
}

export async function setTwitchActions(actionsData) {
	let error = await fs.writeFileSync('./src/config/twitch/actions.json', JSON.stringify(actionsData, null, '  '), 'utf8');
	return error === null;
}

export async function setTwitchCommands(commandsData) {
	let error = await fs.writeFileSync('./src/config/twitch/commands.json', JSON.stringify(commandsData, null, '  '), 'utf8');
	return error === null;
}

export async function setTwitchEvents(eventsData) {
	let error = await fs.writeFileSync('./src/config/twitch/events.json', JSON.stringify(eventsData, null, '  '), 'utf8');
	return error === null;
}

export async function setTwitchGeneral(generalData) {
	let error = await fs.writeFileSync('./src/config/twitch/general.json', JSON.stringify(generalData, null, '  '), 'utf8');
	return error === null;
}
