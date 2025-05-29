import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import {
  createCourse,
  deleteCourse,
  updateCourse,
} from '@/lib/actions/course.actions';
import { ServerResponse } from '@/types';

import { useToast } from '../core/use-toast';

enum CourseMutationType {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

type CourseMutationPayload =
  | {
    type: CourseMutationType.CREATE;
    data: FormData | any;
  }
  | {
    type: CourseMutationType.UPDATE;
    data: FormData | any;
    courseId: string;
  }
  | {
    type: CourseMutationType.DELETE;
    courseId: string;
  };

const useCourseMutation = (
  options?: Omit<
    UseMutationOptions<ServerResponse, Error, CourseMutationPayload>,
    'mutationFn'
  >,
) => {
  const { toast } = useToast();

  const mutationFn = (payload: CourseMutationPayload) => {
    switch (payload.type) {
      case CourseMutationType.CREATE:
        return createCourse(payload.data);
      case CourseMutationType.UPDATE:
        return updateCourse(payload.data, payload.courseId);
      case CourseMutationType.DELETE:
        return deleteCourse(payload.courseId);
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

  return {
    ...mutation,
    createCourse: (data: any) => {
      const apiData = {
        ...data,
      };

      return mutation.mutate({
        type: CourseMutationType.CREATE,
        data: apiData,
      });
    },
    updateCourse: (courseId: string, data: any) => {
      const apiData = {
        ...data,
      };

      return mutation.mutate({
        type: CourseMutationType.UPDATE,
        data: apiData,
        courseId,
      });
    },
    deleteCourse: (courseId: string) => {
      return mutation.mutate({
        type: CourseMutationType.DELETE,
        courseId,
      });
    },
  };
};

export { CourseMutationType, useCourseMutation };

