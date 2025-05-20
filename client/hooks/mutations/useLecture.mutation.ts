import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import {
  createLecture,
  deleteLecture,
  updateLecture,
} from '@/lib/actions/lecture.actions';
import { ServerResponse } from '@/types/shared.types';
import {
  ICreateLectureRequest,
  IGetLectureResponse,
  IUpdateLectureRequest,
} from '@/types/lecture.types';

export enum LectureMutationType {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

type LectureMutationProps = UseMutationOptions<
  ServerResponse,
  unknown,
  {
    type: LectureMutationType;
    lectureData?: ICreateLectureRequest | IUpdateLectureRequest;
    lectureId?: string;
  }
>;

export const useLectureMutation = (options?: LectureMutationProps) => {
  return useMutation({
    ...options,
    mutationFn: async ({
      type,
      lectureData = {},
      lectureId = '',
    }) => {
      let response;

      switch (type) {
        case LectureMutationType.CREATE:
          response = await createLecture(
            lectureData as ICreateLectureRequest
          );
          break;
        case LectureMutationType.UPDATE:
          response = await updateLecture(
            lectureId,
            lectureData as IUpdateLectureRequest
          );
          break;
        case LectureMutationType.DELETE:
          response = await deleteLecture(lectureId);
          break;
        default:
          throw new Error('Unknown mutation type');
      }

      return response.data;
    },
  });
};
