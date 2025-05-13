import { getAllUsers, getOneUser } from '@/lib/actions/user.actions';
import { createGenericQueryHook } from './createGenericQueryHook';

const UserQueryFunctions = {
  GET_ALL: (params: { query: Record<string, any> }) =>
    getAllUsers(params.query),
  GET_ONE: (params: { userId: string }) => getOneUser(params.userId),
} as const;

enum UserQueryType {
  GET_ALL = 'GET_ALL',
  GET_ONE = 'GET_ONE',
}

const useUserQuery = createGenericQueryHook('users', UserQueryFunctions);

export { UserQueryType, useUserQuery };
