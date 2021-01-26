export function deepCompare(input1: any, input2: any): boolean {
	const input1str = JSON.stringify(input1);
	const input2str = JSON.stringify(input2);
	return input1str === input2str;
}
