export interface TwitchActionBanInterface {
	reason?: string;
	id?: string;
	name?: string;
}

export interface TwitchActionDeleteMessageInterface {
	id?: string;
	name?: string;
}

export interface TwitchActionModInterface {
	id?: string;
	name?: string;
}

export interface TwitchActionTimeoutInterface {
	id?: string;
	name?: string;
	time?: number;
	reason?: string;
}

export interface TwitchActionUnbanInterface {
	id?: string;
	name?: string;
}

export interface TwitchActionUnmodInterface {
	id?: string;
	name?: string;
}

export interface TwitchActionUnvipInterface {
	id?: string;
	name?: string;
}

export interface TwitchActionVipInterface {
	id?: string;
	name?: string;
}

export interface TwitchActionsModuleInterface {
	default: TwitchActionsModuleDefaultInterface;
}

export interface TwitchActionsModuleDefaultInterface {
	run: Function;
}

export interface TwitchActionAcionInterface {}

export interface TwitchActionClearInterface {}

export interface TwitchActionColorInterface {}

export interface TwitchActionCommercialInterface {}

export interface TwitchActionConnectInterface {}

export interface TwitchActionDisconnectInterface {}

export interface TwitchActionEmoteonlyInterface {}

export interface TwitchActionEmoteonlyoffInterface {}

export interface TwitchActionFollowersonlyInterface {}

export interface TwitchActionFollowersonlyoffInterface {}

export interface TwitchActionHostInterface {}

export interface TwitchActionJoinInterface {}

export interface TwitchActionModsInterface {}

export interface TwitchActionPartInterface {}

export interface TwitchActionPingInterface {}

export interface TwitchActionR9kbetaInterface {}

export interface TwitchActionR9kbetaoffInterface {}

export interface TwitchActionRawInterface {}

export interface TwitchActionSayInterface {}

export interface TwitchActionSlowInterface {}

export interface TwitchActionSlowoffInterface {}

export interface TwitchActionSubscribersInterface {}

export interface TwitchActionSubscribersoffInterface {}

export interface TwitchActionUnhostInterface {}

export interface TwitchActionVipsInterface {}

export interface TwitchActionWhisperInterface {}
