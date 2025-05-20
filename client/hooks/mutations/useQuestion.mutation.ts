import { createQuestion, deleteQuestion, updateQuestion } from '@/lib/actions/question.actions';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { useToast } from '../core/use-toast';

enum QuestionMutationType {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

type QuestionMutationPayload =
  | {
    type: QuestionMutationType.CREATE;
    data: FormData;
  }
  | {
    type: QuestionMutationType.UPDATE;
    data: FormData;
    questionId: string;
  }
  | {
    type: QuestionMutationType.DELETE;
    questionId: string;
  };

const useQuestionMutation = (
  options?: Omit<
    UseMutationOptions<any, any, QuestionMutationPayload>,
    'mutationFn'
  >,
) => {
  const { toast } = useToast();

  const mutationFn = (payload: QuestionMutationPayload) => {
    switch (payload.type) {
      case QuestionMutationType.CREATE:
        return createQuestion(payload.data);
      case QuestionMutationType.UPDATE:
        return updateQuestion(payload.data, payload.questionId);
      case QuestionMutationType.DELETE:
        return deleteQuestion(payload.questionId);
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

export { QuestionMutationType, useQuestionMutation };
