import { MeteorError } from '@rocket.chat/core-services';
import type { IRole, IUser, IRoom } from '@rocket.chat/core-typings';
import { Users, Roles } from '@rocket.chat/models';

import { validateRoleList } from './validateRoleList';

export const addUserRolesAsync = async (userId: IUser['_id'], roleIds: IRole['_id'][], scope?: IRoom['_id']): Promise<boolean> => {
	if (!userId || !roleIds?.length) {
		return false;
	}

	const user = await Users.findOneById(userId, { projection: { _id: 1 } });
	if (!user) {
		throw new MeteorError('error-invalid-user', 'Invalid user');
	}

	if (!(await validateRoleList(roleIds))) {
		throw new MeteorError('error-invalid-role', 'Invalid role');
	}

	await Roles.addUserRoles(userId, roleIds, scope);
	return true;
};
