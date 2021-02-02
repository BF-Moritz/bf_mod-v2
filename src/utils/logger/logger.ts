import { LoggerLevelType } from '../../types/logger';
import { parseTime } from '../miscellaneous/time';

const levels: LoggerLevelType[] = ['none', 'error', 'warn', 'info', 'debug'];

export default class Logger {
	level: number;

	constructor(level: LoggerLevelType) {
		this.level = levels.findIndex((l) => l === level);
	}

	error(...args: any) {
		if (this.level >= 1) {
			console.error('<' + parseTime() + '> [ERR]', ...args);
		}
	}

	info(...args: any) {
		if (this.level >= 3) {
			console.info('<' + parseTime() + '> [NFO]', ...args);
		}
	}

	warn(...args: any) {
		if (this.level >= 2) {
			console.warn('<' + parseTime() + '> [WRN]', ...args);
		}
	}

	debug(...args: any) {
		if (this.level >= 4) {
			console.debug('<' + parseTime() + '> [DBG]', ...args);
		}
	}
}
