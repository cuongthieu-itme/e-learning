import qs from 'qs';

import { ServerResponse } from '@/types';
import { GetQuestionsDto, IQuestion } from '@/types/question.types';
import {
  deleteApiHandler,
  getApiHandler,
  patchApiHandler,
  postApiHandler,
} from '../api';

export const createQuestion = async (
  data: FormData | any,
): Promise<ServerResponse> => {
  // Handle both FormData and JSON payload
  const headers = data instanceof FormData 
    ? { 'Content-Type': 'multipart/form-data' }
    : { 'Content-Type': 'application/json' };

  return await postApiHandler('question', data, {
    headers,
  });
};

export const updateQuestion = async (
  data: FormData | any,
  questionId: string,
): Promise<ServerResponse> => {
  // Handle both FormData and JSON payload
  const headers = data instanceof FormData 
    ? { 'Content-Type': 'multipart/form-data' }
    : { 'Content-Type': 'application/json' };

  return await patchApiHandler(`question/${questionId}`, data, {
    headers,
  });
};

export const deleteQuestion = async (
  questionId: string,
): Promise<ServerResponse> => {
  return await deleteApiHandler(`question/${questionId}`);
};

export const getAllQuestions = async (
  query: GetQuestionsDto,
): Promise<
  ServerResponse<{
    questions: IQuestion[];
    totalQuestions: number;
  }>
> => {
  const queryString = qs.stringify(query, {
    skipNulls: true,
    arrayFormat: 'brackets',
    encode: false,
  });

  return await getApiHandler(`question?${queryString}`);
};

export const getOneQuestion = async (
  questionId: string,
): Promise<
  ServerResponse<{
    question: IQuestion;
  }>
> => {
  return await getApiHandler(`question/${questionId}`);
};
