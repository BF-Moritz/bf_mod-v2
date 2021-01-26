import fs from 'fs';
import {
	DiscordActionsInterface,
	DiscordChannelsInterface,
	DiscordCommandsInterface,
	DiscordEventsInterface,
	DiscordGeneralInterface
} from '../../interfaces/config/discord';

export async function getDiscordActions(): Promise<DiscordActionsInterface> {
	let configData = await fs.promises.readFile('./src/config/discord/actions.json');
	return JSON.parse(configData.toString()) as DiscordActionsInterface;
}

export async function getDiscordCommands(): Promise<DiscordCommandsInterface> {
	let configData = await fs.promises.readFile('./src/config/discord/commands.json');
	return JSON.parse(configData.toString()) as DiscordCommandsInterface;
}

export async function getDiscordEvents(): Promise<DiscordEventsInterface> {
	let configData = await fs.promises.readFile('./src/config/discord/events.json');
	return JSON.parse(configData.toString()) as DiscordEventsInterface;
}

export async function getDiscordChannels(): Promise<DiscordChannelsInterface> {
	let configData = await fs.promises.readFile('./src/config/discord/channels.json');
	return JSON.parse(configData.toString()) as DiscordChannelsInterface;
}

export async function getDiscordGeneral(): Promise<DiscordGeneralInterface> {
	let configData = await fs.promises.readFile('./src/config/discord/general.json');
	return JSON.parse(configData.toString()) as DiscordGeneralInterface;
}

export async function setDiscordActions(credentials: DiscordActionsInterface): Promise<boolean> {
	let error = await fs.writeFileSync(
		'./src/config/discord/actions.json',
		JSON.stringify(credentials, null, '  '),
		'utf8'
	);
	return error === null;
}

export async function setDiscordCommands(credentials: DiscordCommandsInterface): Promise<boolean> {
	let error = await fs.writeFileSync(
		'./src/config/discord/commands.json',
		JSON.stringify(credentials, null, '  '),
		'utf8'
	);
	return error === null;
}

export async function setDiscordEvents(credentials: DiscordEventsInterface): Promise<boolean> {
	let error = await fs.writeFileSync(
		'./src/config/discord/events.json',
		JSON.stringify(credentials, null, '  '),
		'utf8'
	);
	return error === null;
}

export async function setDiscordChannels(credentials: DiscordChannelsInterface): Promise<boolean> {
	let error = await fs.writeFileSync(
		'./src/config/discord/channels.json',
		JSON.stringify(credentials, null, '  '),
		'utf8'
	);
	return error === null;
}

export async function setDiscordGeneral(credentials: DiscordGeneralInterface): Promise<boolean> {
	let error = await fs.writeFileSync(
		'./src/config/discord/general.json',
		JSON.stringify(credentials, null, '  '),
		'utf8'
	);
	return error === null;
}
