const levels = ['none', 'error', 'warn', 'info', 'debug'];

export default class Logger {
	level: number;

	constructor(level: string) {
		this.level = levels.findIndex((l) => l === level);
	}

	error(...args: any) {
		if (this.level >= 1) {
			console.error('[ERROR]', ...args);
		}
	}

	info(...args: any) {
		if (this.level >= 3) {
			console.info('[INFO]', ...args);
		}
	}

	warn(...args: any) {
		if (this.level >= 2) {
			console.warn('[WARN]', ...args);
		}
	}

	debug(...args: any) {
		if (this.level >= 4) {
			console.debug('[DEBUG]', ...args);
		}
	}
}
