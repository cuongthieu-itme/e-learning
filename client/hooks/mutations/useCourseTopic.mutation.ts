import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import {
    createCourseTopic,
    deleteCourseTopic,
    updateCourseTopic,
} from '@/lib/actions/course-topic.actions';


import { useToast } from '../core/use-toast';

enum CourseTopicMutationType {
    CREATE = 'CREATE',
    UPDATE = 'UPDATE',
    DELETE = 'DELETE',
}

type CourseTopicMutationPayload =
    | {
        type: CourseTopicMutationType.CREATE;
        data: FormData;
    }
    | {
        type: CourseTopicMutationType.UPDATE;
        data: FormData;
        courseTopicId: string;
    }
    | {
        type: CourseTopicMutationType.DELETE;
        courseTopicId: string;
    };

const useCourseTopicMutation = (
    options?: Omit<
        UseMutationOptions<any, any, CourseTopicMutationPayload>,
        'mutationFn'
    >,
) => {
    const { toast } = useToast();

    const mutationFn = (payload: CourseTopicMutationPayload) => {
        switch (payload.type) {
            case CourseTopicMutationType.CREATE:
                return createCourseTopic(payload.data);
            case CourseTopicMutationType.UPDATE:
                return updateCourseTopic(payload.data, payload.courseTopicId);
            case CourseTopicMutationType.DELETE:
                return deleteCourseTopic(payload.courseTopicId);
            default:
                throw new Error('Invalid mutation type');
        }
    };

    const mutation = useMutation({
        mutationFn,
        onError: (error: any) => {
            toast({ title: 'Error', description: error?.response?.data?.message });
        },
        ...options,
    });

    return mutation;
};

export { CourseTopicMutationType, useCourseTopicMutation };
