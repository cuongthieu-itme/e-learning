import { getAllQuestions, getOneQuestion } from '@/lib/actions/question.actions';
import { GetQuestionsDto } from '@/types/question.types';
import { createGenericQueryHook } from './createGenericQueryHook';

const QuestionQueryFunctions = {
  GET_ALL: (params: { query: GetQuestionsDto }) => getAllQuestions(params.query),
  GET_ONE: (params: { questionId: string }) => getOneQuestion(params.questionId),
} as const;

enum QuestionQueryType {
  GET_ALL = 'GET_ALL',
  GET_ONE = 'GET_ONE',
}

const useQuestionQuery = createGenericQueryHook(
  'questions',
  QuestionQueryFunctions,
);

export { QuestionQueryType, useQuestionQuery };
