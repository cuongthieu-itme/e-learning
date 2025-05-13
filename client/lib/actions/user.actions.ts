import { IUser, UpdateProfileDto } from '@/types';
import qs from 'qs';
import { GetUsersDto } from '../../../api/src/models/user/dto/get-users.dto';
import { deleteApiHandler, getApiHandler, patchApiHandler } from '../api';

export const updateProfile = async (
  data: UpdateProfileDto,
): Promise<ServerResponse> => {
  return await patchApiHandler('user/update', data);
};

export const getProfile = async (): Promise<
  ServerResponse<{
    user: IUser;
  }>
> => {
  return await getApiHandler('user/profile');
};

export const getAllUsers = async (
  query: GetUsersDto,
): Promise<
  ServerResponse<{
    users: IUser[];
    totalUsers: number;
  }>
> => {
  const queryString = qs.stringify(query, {
    skipNulls: true,
    arrayFormat: 'brackets',
    encode: false,
  });

  return await getApiHandler(`user/all?${queryString}`);
};

export const deleteUser = async (userId: string): Promise<ServerResponse> => {
  return await deleteApiHandler(`user/${userId}`);
};
