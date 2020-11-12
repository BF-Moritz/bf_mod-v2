export function send(ws, data) {
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