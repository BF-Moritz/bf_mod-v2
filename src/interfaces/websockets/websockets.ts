import { WebsocketConnectTypes, WebsocketPlatformTypes } from '../../types/websocketTypes';

export interface ConnectDataInterface {
	client: WebsocketConnectTypes;
}

export interface GetMessagesDataInterface {
	count: number | null;
	index: number | null;
}

export interface GetViewerDataInterface {}

export interface PostMessageDataInterface {
	author: string;
	message: string;
}

export interface PostActionDataInterface {
	platform: WebsocketPlatformTypes;
	action: string;
	id: number;
}

export interface GetUserInformationDataInterfac {
	id: string;
}
