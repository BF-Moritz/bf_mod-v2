export interface ActivityObjectInterface {
	_id?: string;
	channel: string;
	type: string;
	activity: ActivityInterface;
	seen: boolean;
	index: number;
	date: Date;
}

export interface ActivityInterface {}
