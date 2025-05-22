import { getAllCourseTopics, getOneCourseTopic, getRandomCourseTopics } from '@/lib/actions/course-topic.actions';
import { GetCourseTopicsDto } from '@/types/course-topic.types';
import { createGenericQueryHook } from './createGenericQueryHook';

const CourseTopicQueryFunctions = {
    GET_ALL: (params: { query: GetCourseTopicsDto }) => getAllCourseTopics(params.query),
    GET_ONE: (params: { courseTopicId: string }) => getOneCourseTopic(params.courseTopicId),
    GET_RANDOM: (params?: { count?: number }) => getRandomCourseTopics(params?.count),
} as const;

enum CourseTopicQueryType {
    GET_ALL = 'GET_ALL',
    GET_ONE = 'GET_ONE',
    GET_RANDOM = 'GET_RANDOM',
}

const useCourseTopicQuery = createGenericQueryHook(
    'course-topics',
    CourseTopicQueryFunctions,
);

export { CourseTopicQueryType, useCourseTopicQuery };

