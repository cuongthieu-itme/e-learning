import qs from 'qs';

import { GetQuestionsDto, IQuestion } from '@/types/question.types';
import {
  deleteApiHandler,
  getApiHandler,
  patchApiHandler,
  postApiHandler,
} from '../api';

export const createQuestion = async (
  data: FormData,
): Promise<ServerResponse> => {
  return await postApiHandler('question/create', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const updateQuestion = async (
  data: FormData,
  questionId: string,
): Promise<ServerResponse> => {
  return await patchApiHandler(`question/update/${questionId}`, data);
};

export const deleteQuestion = async (
  questionId: string,
): Promise<ServerResponse> => {
  return await deleteApiHandler(`question/delete/${questionId}`);
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
