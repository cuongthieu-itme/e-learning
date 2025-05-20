import qs from 'qs';

import { ServerResponse } from '@/types';
import { GetCourseTopicsDto, ICourseTopic } from '@/types/course-topic.types';
import {
    deleteApiHandler,
    getApiHandler,
    patchApiHandler,
    postApiHandler,
} from '../api';

export const createCourseTopic = async (
    data: FormData | any,
): Promise<ServerResponse> => {
    // Handle both FormData and JSON payload
    const headers = data instanceof FormData
        ? { 'Content-Type': 'multipart/form-data' }
        : { 'Content-Type': 'application/json' };

    return await postApiHandler('course-topic', data, {
        headers,
    });
};

export const updateCourseTopic = async (
    data: FormData,
    courseTopicId: string,
): Promise<ServerResponse> => {
    return await patchApiHandler(`course-topic/${courseTopicId}`, data);
};

export const deleteCourseTopic = async (
    courseTopicId: string,
): Promise<ServerResponse> => {
    return await deleteApiHandler(`course-topic/${courseTopicId}`);
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
