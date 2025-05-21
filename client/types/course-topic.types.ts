
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

export interface ICourse {
    _id: string;
    name: string;
    subject: string;
}

export interface ICourseTopic {
    _id: string;
    courseId: string | ICourse;
    topic: string;
    createdAt?: Date;
    updatedAt?: Date;
    __v?: number;
}
