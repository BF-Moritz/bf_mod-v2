export interface ActivityObjectInterface {
	_id?: string;
	channel: string;
	type: string;
	activity: ActivityInterface;
	seen: boolean;
	index: number;
	date: Date;
}

export interface ActivityInterface {
	name: string | null;
	sender: string | null;
	message: string | null;
	amount: number;
	tier: number;
	gifted: boolean;
	upgrade: null | 'prime' | 'gift';
}
