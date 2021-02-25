import { services } from '../../app';
import { UserBirthdayInterface } from '../../interfaces/user';

export async function setBirthday(userID: string, birthday: UserBirthdayInterface): Promise<boolean> {
	const user = await services.db.users.getUserByID(userID);
	if (!user) return false;
	user.birthday = birthday;
	return (await services.db.users.updateUser(user)) !== null;
}
