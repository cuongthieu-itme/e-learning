import qs from 'qs';

import { ServerResponse } from '@/types';
import { GetLecturesDto, ILecture } from '@/types/lecture.types';
import {
  deleteApiHandler,
  getApiHandler,
  patchApiHandler,
  postApiHandler,
} from '../api';

export const createLecture = async (
  data: FormData | any,
): Promise<ServerResponse> => {
  // Handle both FormData and JSON payload
  const headers = data instanceof FormData 
    ? { 'Content-Type': 'multipart/form-data' }
    : { 'Content-Type': 'application/json' };

  return await postApiHandler('lecture', data, {
    headers,
  });
};

export const updateLecture = async (
  data: FormData | any,
  lectureId: string,
): Promise<ServerResponse> => {
  // Handle both FormData and JSON payload
  const headers = data instanceof FormData 
    ? { 'Content-Type': 'multipart/form-data' }
    : { 'Content-Type': 'application/json' };

  return await patchApiHandler(`lecture/${lectureId}`, data, {
    headers,
  });
};

export const deleteLecture = async (
  lectureId: string,
): Promise<ServerResponse> => {
  return await deleteApiHandler(`lecture/${lectureId}`);
};

export const getAllLectures = async (
  query: GetLecturesDto,
): Promise<
  ServerResponse<{
    lectures: ILecture[];
    totalLectures: number;
  }>
> => {
  const queryString = qs.stringify(query, {
    skipNulls: true,
    arrayFormat: 'brackets',
    encode: false,
  });

  return await getApiHandler(`lecture?${queryString}`);
};

export const getOneLecture = async (
  lectureId: string,
): Promise<
  ServerResponse<{
    lecture: ILecture;
  }>
> => {
  return await getApiHandler(`lecture/${lectureId}`);
};
