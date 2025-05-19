import qs from 'qs';

import { GetCoursesDto, ICourse } from '@/types';

import {
  deleteApiHandler,
  getApiHandler,
  patchApiHandler,
  postApiHandler,
} from '../api';

export const createCourse = async (
  data: FormData,
): Promise<ServerResponse> => {
  return await postApiHandler('course/create', data);
};

export const updateCourse = async (
  data: FormData,
  courseId: string,
): Promise<ServerResponse> => {
  return await patchApiHandler(`course/update/${courseId}`, data);
};

export const deleteCourse = async (
  courseId: string,
): Promise<ServerResponse> => {
  return await deleteApiHandler(`course/delete/${courseId}`);
};

export const getAllCourses = async (
  query: GetCoursesDto,
): Promise<
  ServerResponse<{
    courses: ICourse[];
    totalCourses: number;
    currentPage: number;
    totalPages: number;
  }>
> => {
  const queryString = qs.stringify(query, {
    skipNulls: true,
    arrayFormat: 'brackets',
    encode: false,
  });

  return await getApiHandler(`course?${queryString}`);
};

export const getOneCourse = async (
  courseId: string,
): Promise<
  ServerResponse<{
    course: ICourse;
  }>
> => {
  return await getApiHandler(`course/${courseId}`, {
    withCredentials: false,
  });
};
