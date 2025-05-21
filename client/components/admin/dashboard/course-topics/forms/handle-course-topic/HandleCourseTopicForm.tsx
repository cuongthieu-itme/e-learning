'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { queryClient } from '@/context/react-query-client';
import { useToast } from '@/hooks/core/use-toast';
import { ICourseTopic } from '@/types/course-topic.types';
import { CourseTopicMutationType, useCourseTopicMutation } from '@/hooks/mutations/useCourseTopic.mutation';

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
import Loader from '@/components/ui/info/loader';
import { Separator } from '@/components/ui/layout/separator';

const CreateCourseTopicSchema = z.object({
  courseId: z.string().min(1, 'Course ID is required'),
  topic: z.string().min(1, 'Topic name is required'),
});

const UpdateCourseTopicSchema = CreateCourseTopicSchema.partial();

type CourseTopicFormValues = {
  courseId: string;
  topic: string;
};

type HandleCourseTopicFormProps =
  | {
    isEdit?: true;
    courseTopic: ICourseTopic;
  }
  | { isEdit?: false; courseTopic: undefined };

const HandleCourseTopicForm: React.FC<HandleCourseTopicFormProps> = (props) => {
  const { toast } = useToast();
  const router = useRouter();

  const schema = props.isEdit ? UpdateCourseTopicSchema : CreateCourseTopicSchema;

  const form = useForm<CourseTopicFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      courseId: '682ad3dff69fbc18179a0062', // Default course ID as specified in the request
      topic: '',
    },
  });

  const courseTopicMutation = useCourseTopicMutation({
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['courseTopics'] });

      form.reset();

      toast({
        title: `Success ${response.statusCode} 🚀`,
        description: response.message,
      });

      setTimeout(() => {
        router.push('/dashboard/course-topics');
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

  const isLoading = courseTopicMutation.status === 'pending';

  useEffect(() => {
    if (props.isEdit && props.courseTopic) {
      const formValues: CourseTopicFormValues = {
        courseId: typeof props.courseTopic.courseId === 'object' && '_id' in props.courseTopic.courseId 
          ? props.courseTopic.courseId._id 
          : String(props.courseTopic.courseId),
        topic: props.courseTopic.topic,
      };
      form.reset(formValues);
    }
  }, [props.courseTopic, props.isEdit, form]);

  const handleFormSubmit = async (data: CourseTopicFormValues) => {
    if (props.isEdit) {
      courseTopicMutation.mutate({
        type: CourseTopicMutationType.UPDATE,
        data: data as any,
        courseTopicId: props.courseTopic._id,
      });
    } else {
      courseTopicMutation.mutate({
        type: CourseTopicMutationType.CREATE,
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
            name="courseId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID Khóa học</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập ID khóa học" {...field} />
                </FormControl>
                <FormDescription>
                  ID của khóa học mà chủ đề này thuộc về.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chủ đề</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập tên chủ đề" {...field} />
                </FormControl>
                <FormDescription>
                  Vui lòng nhập tên chủ đề cho khóa học.
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
              'Lưu chủ đề'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default HandleCourseTopicForm;
