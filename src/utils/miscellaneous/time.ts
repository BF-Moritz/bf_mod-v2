export function parseTime(time: Date = new Date(Date.now())): string {
	const hours = ('00' + time.getHours()).slice(-2);
	const minutes = ('00' + time.getMinutes()).slice(-2);
	const seconds = ('00' + time.getSeconds()).slice(-2);

	return `${hours}:${minutes}:${seconds}`;
}
