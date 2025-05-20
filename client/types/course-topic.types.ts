
export type CreateCourseTopicDto = {
    courseId: string;
    topic: string;
};

export type GetCourseTopicsDto = {
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
};

export interface ICourseTopic {
    _id: string;
    courseId: string;
    topic: string;
    createdAt: Date;
    updatedAt: Date;
}
