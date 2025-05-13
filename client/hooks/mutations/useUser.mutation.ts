import { createUser, deleteUser, updateUser } from '@/lib/actions/user.actions';
import { ServerResponse } from '@/types';
import { useMutation } from '@tanstack/react-query';

const UserMutationFunctions = {
  CREATE: (params: { data: any }) => createUser(params.data),
  UPDATE: (params: { userId: string; data: any }) =>
    updateUser(params.userId, params.data),
  DELETE: (params: { userId: string }) => deleteUser(params.userId),
} as const;

enum UserMutationType {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

type UserMutationPayload = {
  type: UserMutationType;
  userId?: string;
  data?: any;
};

const useUserMutation = (options?: any) => {
  return useMutation<ServerResponse, Error, UserMutationPayload>({
    mutationFn: async (payload) => {
      const mutationFn = UserMutationFunctions[payload.type];
      return mutationFn(payload as any);
    },
    ...options,
  });
};

export { UserMutationType, useUserMutation };
