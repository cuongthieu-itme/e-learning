import { createLecture, deleteLecture, updateLecture } from '@/lib/actions/lecture.actions';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { useToast } from '../core/use-toast';

enum LectureMutationType {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

type LectureMutationPayload =
  | {
    type: LectureMutationType.CREATE;
    data: FormData;
  }
  | {
    type: LectureMutationType.UPDATE;
    data: FormData;
    lectureId: string;
  }
  | {
    type: LectureMutationType.DELETE;
    lectureId: string;
  };

const useLectureMutation = (
  options?: Omit<
    UseMutationOptions<any, any, LectureMutationPayload>,
    'mutationFn'
  >,
) => {
  const { toast } = useToast();

  const mutationFn = (payload: LectureMutationPayload) => {
    switch (payload.type) {
      case LectureMutationType.CREATE:
        return createLecture(payload.data);
      case LectureMutationType.UPDATE:
        return updateLecture(payload.data, payload.lectureId);
      case LectureMutationType.DELETE:
        return deleteLecture(payload.lectureId);
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

export { LectureMutationType, useLectureMutation };
