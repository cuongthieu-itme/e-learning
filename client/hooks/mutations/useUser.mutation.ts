import { deleteUser } from '@/lib/actions/user.actions';
import { ServerResponse } from '@/types';
import { useMutation } from '@tanstack/react-query';

const UserMutationFunctions = {
  DELETE: (params: { userId: string }) => deleteUser(params.userId),
} as const;

enum UserMutationType {
  DELETE = 'DELETE',
}

type UserMutationPayload = {
  type: UserMutationType;
  userId: string;
};

const useUserMutation = (options?: any) => {
  return useMutation<ServerResponse, Error, UserMutationPayload>({
    mutationFn: async (payload) => {
      const mutationFn = UserMutationFunctions[payload.type];
      return mutationFn({ userId: payload.userId });
    },
    ...options,
  });
};

export { UserMutationType, useUserMutation };
