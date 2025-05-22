import { createGenericQueryHook } from './createGenericQueryHook';
import { GetCoursesDto } from '@/types';
import { getAllCourses, getOneCourse, getRandomCourses } from '@/lib/actions/course.actions';

const CourseQueryFunctions = {
  GET_ALL: (params: { query: GetCoursesDto }) => getAllCourses(params.query),
  GET_ONE: (params: { courseId: string }) => getOneCourse(params.courseId),
  GET_RANDOM: () => getRandomCourses(),
} as const;

enum CourseQueryType {
  GET_ALL = 'GET_ALL',
  GET_ONE = 'GET_ONE',
  GET_RANDOM = 'GET_RANDOM',
}

const useCourseQuery = createGenericQueryHook(
  'courses',
  CourseQueryFunctions,
);

export { useCourseQuery, CourseQueryType };
