import { getAllUsers } from '@/lib/actions/user.actions';
import { createGenericQueryHook } from './createGenericQueryHook';

const UserQueryFunctions = {
  GET_ALL: (params: { query: Record<string, any> }) =>
    getAllUsers(params.query),
} as const;

enum UserQueryType {
  GET_ALL = 'GET_ALL',
}

const useUserQuery = createGenericQueryHook('users', UserQueryFunctions);

export { UserQueryType, useUserQuery };
