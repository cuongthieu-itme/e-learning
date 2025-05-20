import qs from 'qs';

import { GetLecturesDto, ILecture } from '@/types/lecture.types';
import {
  deleteApiHandler,
  getApiHandler,
  patchApiHandler,
  postApiHandler,
} from '../api';

export const createLecture = async (
  data: FormData,
): Promise<ServerResponse> => {
  return await postApiHandler('lecture/create', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const updateLecture = async (
  data: FormData,
  lectureId: string,
): Promise<ServerResponse> => {
  return await patchApiHandler(`lecture/update/${lectureId}`, data);
};

export const deleteLecture = async (
  lectureId: string,
): Promise<ServerResponse> => {
  return await deleteApiHandler(`lecture/delete/${lectureId}`);
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
