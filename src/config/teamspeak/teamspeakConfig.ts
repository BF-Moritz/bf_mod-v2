import fs from 'fs';
import {
	TeamspeakCommandsInterface,
	TeamspeakEventsInterface,
	TeamspeakGeneralInterface
} from '../../interfaces/config/teamspeak';

export async function getTeamspeakCommands(): Promise<TeamspeakCommandsInterface> {
	let commandsData = await fs.promises.readFile('./src/config/teamspeak/commands.json');
	return JSON.parse(commandsData.toString()) as TeamspeakCommandsInterface;
}

export async function getTeamspeakEvents(): Promise<TeamspeakEventsInterface> {
	let eventsData = await fs.promises.readFile('./src/config/teamspeak/events.json');
	return JSON.parse(eventsData.toString()) as TeamspeakEventsInterface;
}

export async function getTeamspeakGeneral(): Promise<TeamspeakGeneralInterface> {
	let generalData = await fs.promises.readFile('./src/config/teamspeak/general.json');
	return JSON.parse(generalData.toString()) as TeamspeakGeneralInterface;
}

export async function setTeamspeakCommands(commandsData: TeamspeakCommandsInterface): Promise<boolean> {
	let error = await fs.writeFileSync(
		'./src/config/teamspeak/commands.json',
		JSON.stringify(commandsData, null, '  '),
		'utf8'
	);
	return error === null;
}

export async function setTeamspeakEvents(eventsData: TeamspeakEventsInterface): Promise<boolean> {
	let error = await fs.writeFileSync(
		'./src/config/teamspeak/events.json',
		JSON.stringify(eventsData, null, '  '),
		'utf8'
	);
	return error === null;
}

export async function setTeamspeakGeneral(generalData: TeamspeakGeneralInterface): Promise<boolean> {
	let error = await fs.writeFileSync(
		'./src/config/teamspeak/general.json',
		JSON.stringify(generalData, null, '  '),
		'utf8'
	);
	return error === null;
}
