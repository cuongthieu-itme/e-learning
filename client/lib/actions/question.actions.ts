import qs from 'qs';

import { ServerResponse } from '@/types';
import { GetQuestionsDto, IQuestion } from '@/types/question.types';
import {
  deleteApiHandler,
  getApiHandler,
  patchApiHandler,
  postApiHandler,
} from '../api';

export interface GenerateAiQuestionsDto {
  lectureId: string;
  lecture: string;
  count: number;
}

export interface CreateBatchQuestionsDto {
  questions: any[];
}

export const createQuestion = async (
  data: FormData | any,
): Promise<ServerResponse> => {
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

/**
 * Get all questions for a lecture randomly sorted without pagination
 * @param lectureId Lecture ID to fetch questions for
 * @returns Promise with randomly sorted questions for the lecture
 */
export const getAllQuestionsRandomByLectureId = async (
  lectureId: string,
): Promise<
  ServerResponse<{
    questions: IQuestion[];
    totalQuestions: number;
  }>
> => {
  return await getApiHandler(`question/random-all/${lectureId}`);
};

/**
 * Generate questions using AI based on lecture information
 * @param data Object containing lectureId, lecture name, and count
 * @returns Promise with generated questions
 */
export const generateAiQuestions = async (
  data: GenerateAiQuestionsDto
): Promise<
  ServerResponse<{
    questions: IQuestion[];
  }>
> => {
  return await postApiHandler('question/generate-ai', data);
};

/**
 * Create multiple questions in a batch
 * @param data Object containing an array of questions
 * @returns Promise with created questions
 */
export const createBatchQuestions = async (
  data: CreateBatchQuestionsDto
): Promise<
  ServerResponse<{
    questions: IQuestion[];
    questionsCount: number;
  }>
> => {
  return await postApiHandler('question/batch', data);
};
