export interface DiscordInterface {
	token: string;
}

export interface StreamerInterface {
	name: string;
	oAuth: string;
	channels: string[];
	id: string;
}

export interface BotInterface {
	name: string;
	oAuth: string;
	channels: string[];
	secret: string;
	clientID: string;
	appOAUTH: string;
	appOAUTH_expires: number;
	scopes: string[];
	clientAccesTokenExpireDate: Date;
	clientAccesToken: string;
	clientRefreshToken: string;
}

export interface TwitchInterface {
	streamer: StreamerInterface;
	bot: BotInterface;
}

export interface StreamElementsInterface {
	jwtToken: string;
	overlayToken: string;
	id: string;
}

export interface YoutubeInterface {
	apiKey: string;
}

export interface Api2Interface {
	path: string;
	version: string;
}

export interface WsInterface {
	path: string;
}

export interface ViewsInterface {
	path: string;
}

export interface ApiInterface {
	api: Api2Interface;
	ws: WsInterface;
	views: ViewsInterface;
	port: number;
}

export interface TwitchMessagesInterface {
	name: string;
}

export interface TwitchActivitiesInterface {
	name: string;
}

export interface UsersInterface {
	name: string;
}

export interface DbsInterface {
	mongo_uri: string;
	mongo_uri_old: string;
	twitchMessages: TwitchMessagesInterface;
	twitch_activities: TwitchActivitiesInterface;
	users: UsersInterface;
}

export interface TeamspeakInterface {
	host: string;
	serverport: number;
	username: string;
	password: string;
	nickname: string;
	defaultChannelID: string;
}

export interface SpotifyInterface {
	clientID: string;
	secret: string;
	scopes: string[];
	tokenType: string;
	expiresIn: number;
	refresh_token: string;
	market: string;
	accessToken: string;
}

export interface PubgInterface {
	apiKey: string;
	playerID: string;
}

export interface CredentialsInterface {
	discord: DiscordInterface;
	twitch: TwitchInterface;
	streamElements: StreamElementsInterface;
	youtube: YoutubeInterface;
	api: ApiInterface;
	dbs: DbsInterface;
	teamspeak: TeamspeakInterface;
	spotify: SpotifyInterface;
	pubg: PubgInterface;
}
