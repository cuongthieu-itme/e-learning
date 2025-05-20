import { getAllCourseTopics, getOneCourseTopic } from '@/lib/actions/course-topic.actions';
import { GetCourseTopicsDto } from '@/types/course-topic.types';
import { createGenericQueryHook } from './createGenericQueryHook';

const CourseTopicQueryFunctions = {
    GET_ALL: (params: { query: GetCourseTopicsDto }) => getAllCourseTopics(params.query),
    GET_ONE: (params: { courseTopicId: string }) => getOneCourseTopic(params.courseTopicId),
} as const;

enum CourseTopicQueryType {
    GET_ALL = 'GET_ALL',
    GET_ONE = 'GET_ONE',
}

const useCourseTopicQuery = createGenericQueryHook(
    'course-topics',
    CourseTopicQueryFunctions,
);

export { CourseTopicQueryType, useCourseTopicQuery };

