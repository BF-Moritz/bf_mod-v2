import fs from 'fs';
import path from 'path';

export async function readFiles(dir, func, params) {
	let files = await fs.promises.readdir(dir);
	for (let file of files) {
		let stat = await fs.promises.lstat(path.join(dir, file));
		if (stat.isDirectory()) {
			await readFiles(path.join(dir, file), func, params);
		} else if (file.endsWith('.js')) {
			await func(dir, file, params);
		}
	}
}
