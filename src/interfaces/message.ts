import { BadgeInfo, Badges, Userstate } from 'tmi.js';
import { UserInterface } from './user';

export interface MessageDBInterface {
	_id?: string;
	channel: string;
	type: string;
	message: MessageObjectInterface;
	user?: UserInterface;
	deleted: boolean;
	index: number;
	date: Date;
}

export interface MessageObjectInterface {
	id: string;
	twitchID: string;
	timestampTMI: string;
	roomID: string;
	emotes: EmotesInterface;
	flags: string;
	badges: Badges;
	badgesRaw: string;
	badgeInfo: BadgeInfo;
	badgesInfoRaw: string;
	parsedBadges: ParsedBadgesInterface[];
	clientNonce: string | null;
	type: Userstate['message-type'];
	message: string;
	reply: null | MessageReplyInterface;
	bits?: string;
	emotesRaw?: string;
}

export interface EmotesInterface {
	[emoteid: string]: string[];
}

export interface MessageReplyInterface {
	parentDisplayName?: string;
	parentMessageBody?: string;
	parentMessageID?: string;
	parentUserID?: string;
	parentUserName?: string;
}

export interface ParsedBadgesInterface {
	name: string;
	version: string;
}
