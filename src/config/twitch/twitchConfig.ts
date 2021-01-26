import fs from 'fs';
import {
	TwitchActionsInterface,
	TwitchCommandsInterface,
	TwitchEventsInterface,
	TwitchGeneralInterface
} from '../../interfaces/config/twitch';

export async function getTwitchActions(): Promise<TwitchActionsInterface> {
	let actionsData = await fs.promises.readFile('./src/config/twitch/actions.json');
	return JSON.parse(actionsData.toString()) as TwitchActionsInterface;
}

export async function getTwitchCommands(): Promise<TwitchCommandsInterface> {
	let commandsData = await fs.promises.readFile('./src/config/twitch/commands.json');
	return JSON.parse(commandsData.toString()) as TwitchCommandsInterface;
}

export async function getTwitchEvents(): Promise<TwitchEventsInterface> {
	let eventsData = await fs.promises.readFile('./src/config/twitch/events.json');
	return JSON.parse(eventsData.toString()) as TwitchEventsInterface;
}

export async function getTwitchGeneral(): Promise<TwitchGeneralInterface> {
	let generalData = await fs.promises.readFile('./src/config/twitch/general.json');
	return JSON.parse(generalData.toString());
}

export async function setTwitchActions(actionsData: TwitchActionsInterface): Promise<boolean> {
	let error = await fs.writeFileSync(
		'./src/config/twitch/actions.json',
		JSON.stringify(actionsData, null, '  '),
		'utf8'
	);
	return error === null;
}

export async function setTwitchCommands(commandsData: TwitchCommandsInterface): Promise<boolean> {
	let error = await fs.writeFileSync(
		'./src/config/twitch/commands.json',
		JSON.stringify(commandsData, null, '  '),
		'utf8'
	);
	return error === null;
}

export async function setTwitchEvents(eventsData: TwitchEventsInterface): Promise<boolean> {
	let error = await fs.writeFileSync(
		'./src/config/twitch/events.json',
		JSON.stringify(eventsData, null, '  '),
		'utf8'
	);
	return error === null;
}

export async function setTwitchGeneral(generalData: TwitchGeneralInterface): Promise<boolean> {
	let error = await fs.writeFileSync(
		'./src/config/twitch/general.json',
		JSON.stringify(generalData, null, '  '),
		'utf8'
	);
	return error === null;
}
