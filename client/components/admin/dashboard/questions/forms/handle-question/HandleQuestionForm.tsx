'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { queryClient } from '@/context/react-query-client';
import { useToast } from '@/hooks/core/use-toast';
import { QuestionMutationType, useQuestionMutation } from '@/hooks/mutations/useQuestion.mutation';
import { IQuestion } from '@/types/question.types';

import { Button } from '@/components/ui/buttons/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form/form';
import { Input } from '@/components/ui/form/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/form/select';
import { Textarea } from '@/components/ui/form/textarea';
import Loader from '@/components/ui/info/loader';
import { Separator } from '@/components/ui/layout/separator';

const CreateQuestionSchema = z.object({
  lectureId: z.string().min(1, 'Lecture ID is required'),
  createdById: z.string().min(1, 'Creator ID is required'),
  question: z.string().min(1, 'Question text is required'),
  optionA: z.string().min(1, 'Option A is required'),
  optionB: z.string().min(1, 'Option B is required'),
  optionC: z.string().min(1, 'Option C is required'),
  optionD: z.string().min(1, 'Option D is required'),
  correctAnswer: z.string().min(1, 'Correct answer is required'),
  explanation: z.string().optional(),
});

const UpdateQuestionSchema = CreateQuestionSchema.partial();

type QuestionFormValues = {
  lectureId: string;
  createdById: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  explanation?: string;
};

type HandleQuestionFormProps =
  | {
    isEdit?: true;
    question: IQuestion;
  }
  | { isEdit?: false; question: undefined };

const HandleQuestionForm: React.FC<HandleQuestionFormProps> = (props) => {
  const { toast } = useToast();
  const router = useRouter();

  const schema = props.isEdit ? UpdateQuestionSchema : CreateQuestionSchema;

  const form = useForm<QuestionFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      lectureId: '64fa9dc4d6e8f40ad8a12345', // Default lecture ID as specified in the request
      createdById: '64fa9d0ad6e8f40ad8a12345', // Default creator ID as specified in the request
      question: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctAnswer: 'A',
      explanation: '',
    },
  });

  const questionMutation = useQuestionMutation({
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });

      form.reset();

      toast({
        title: `Success ${response.statusCode} 🚀`,
        description: response.message,
      });

      setTimeout(() => {
        router.push('/dashboard/questions');
      }, 1000);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error?.response?.data?.message,
        variant: 'destructive',
      });
    },
  });

  const isLoading = questionMutation.status === 'pending';

  useEffect(() => {
    if (props.isEdit && props.question) {
      const formValues: QuestionFormValues = {
        lectureId: props.question.lectureId,
        createdById: props.question.createdById,
        question: props.question.question,
        optionA: props.question.optionA,
        optionB: props.question.optionB,
        optionC: props.question.optionC,
        optionD: props.question.optionD,
        correctAnswer: props.question.correctAnswer,
        explanation: props.question.explanation,
      };
      form.reset(formValues);
    }
  }, [props.question, props.isEdit, form]);

  const handleFormSubmit = async (data: QuestionFormValues) => {
    if (props.isEdit) {
      questionMutation.mutate({
        type: QuestionMutationType.UPDATE,
        data: data as any,
        questionId: props.question._id,
      });
    } else {
      questionMutation.mutate({
        type: QuestionMutationType.CREATE,
        data: data as any,
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="flex flex-col gap-8 md:flex-row"
      >
        <div className="flex-1 space-y-5">
          <FormField
            control={form.control}
            name="lectureId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID Bài giảng</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập ID bài giảng" {...field} />
                </FormControl>
                <FormDescription>
                  ID của bài giảng mà câu hỏi này thuộc về.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="createdById"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID Người tạo</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập ID người tạo" {...field} />
                </FormControl>
                <FormDescription>
                  ID của người tạo câu hỏi này.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="question"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Câu hỏi</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Nhập nội dung câu hỏi"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Nội dung câu hỏi.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField
              control={form.control}
              name="optionA"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phương án A</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập phương án A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="optionB"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phương án B</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập phương án B" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="optionC"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phương án C</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập phương án C" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="optionD"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phương án D</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập phương án D" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="correctAnswer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Đáp án đúng</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn đáp án đúng" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="A">A</SelectItem>
                    <SelectItem value="B">B</SelectItem>
                    <SelectItem value="C">C</SelectItem>
                    <SelectItem value="D">D</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Đáp án đúng của câu hỏi.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="explanation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giải thích</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Nhập giải thích cho đáp án"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Giải thích lý do tại sao đáp án được chọn là đáp án đúng.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Separator className="my-4" />
          <Button type="submit" disabled={!form.formState.isValid || isLoading}>
            {form.formState.isSubmitting || isLoading ? (
              <Loader type="ScaleLoader" height={20} color="#ffffff" />
            ) : (
              'Lưu câu hỏi'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default HandleQuestionForm;
