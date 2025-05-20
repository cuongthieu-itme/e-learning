import { getAllLectures, getOneLecture } from '@/lib/actions/lecture.actions';
import { GetLecturesDto } from '@/types/lecture.types';
import { createGenericQueryHook } from './createGenericQueryHook';

const LectureQueryFunctions = {
  GET_ALL: (params: { query: GetLecturesDto }) => getAllLectures(params.query),
  GET_ONE: (params: { lectureId: string }) => getOneLecture(params.lectureId),
} as const;

enum LectureQueryType {
  GET_ALL = 'GET_ALL',
  GET_ONE = 'GET_ONE',
}

const useLectureQuery = createGenericQueryHook(
  'lectures',
  LectureQueryFunctions,
);

export { LectureQueryType, useLectureQuery };

