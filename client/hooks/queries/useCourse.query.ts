import { createGenericQueryHook } from './createGenericQueryHook';
import { GetCoursesDto } from '@/types';
import { getAllCourses, getOneCourse } from '@/lib/actions/course.actions';

const CourseQueryFunctions = {
  GET_ALL: (params: { query: GetCoursesDto }) => getAllCourses(params.query),
  GET_ONE: (params: { courseId: string }) => getOneCourse(params.courseId),
} as const;

enum CourseQueryType {
  GET_ALL = 'GET_ALL',
  GET_ONE = 'GET_ONE',
}

const useCourseQuery = createGenericQueryHook(
  'courses',
  CourseQueryFunctions,
);

export { useCourseQuery, CourseQueryType };
