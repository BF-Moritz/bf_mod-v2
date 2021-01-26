import { MessageDBInterface } from '../../../../interfaces/message';
import { UserInterface } from '../../../../interfaces/user';

export default {
	run: async (channel: string, user: UserInterface, message: MessageDBInterface, args: string[]) => {},
	aliases: [],
	description: 'test',
	clients: ['bf_mod']
};
