import * as ws from 'ws';

export function send(ws: ws, data: Object): Boolean {
	const json = JSON.stringify({
		jsonrpc: '2.0',
		...data
	});
	if (ws.readyState === 1) {
		ws.send(json);
		return true;
	} else {
		return false;
	}
}
