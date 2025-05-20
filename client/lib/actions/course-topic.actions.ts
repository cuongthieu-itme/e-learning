import qs from 'qs';

import { GetCourseTopicsDto, ICourseTopic } from '@/types/course-topic.types';
import {
    deleteApiHandler,
    getApiHandler,
    patchApiHandler,
    postApiHandler,
} from '../api';

export const createCourseTopic = async (
    data: FormData,
): Promise<ServerResponse> => {
    return await postApiHandler('course-topic/create', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

export const updateCourseTopic = async (
    data: FormData,
    courseTopicId: string,
): Promise<ServerResponse> => {
    return await patchApiHandler(`course-topic/update/${courseTopicId}`, data);
};

export const deleteCourseTopic = async (
    courseTopicId: string,
): Promise<ServerResponse> => {
    return await deleteApiHandler(`course-topic/delete/${courseTopicId}`);
};

export const getAllCourseTopics = async (
    query: GetCourseTopicsDto,
): Promise<
    ServerResponse<{
        courseTopics: ICourseTopic[];
        totalCourseTopics: number;
    }>
> => {
    const queryString = qs.stringify(query, {
        skipNulls: true,
        arrayFormat: 'brackets',
        encode: false,
    });

    return await getApiHandler(`course-topic?${queryString}`);
};

export const getOneCourseTopic = async (
    courseTopicId: string,
): Promise<
    ServerResponse<{
        courseTopic: ICourseTopic;
    }>
> => {
    return await getApiHandler(`course-topic/${courseTopicId}`);
};
