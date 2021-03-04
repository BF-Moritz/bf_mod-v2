export interface BTTVGlobalEmotesInterface {
	id: String;
	code: String;
	imageType: String;
	userId: String;
}

export interface BTTVUserEmotesInterface {
	id: String;
	name: String;
	displayName: String;
	providerId: String;
	bots: String[];
	channelEmotes: any[];
	sharedEmotes: any[];
}
