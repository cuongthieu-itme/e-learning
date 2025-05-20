'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { queryClient } from '@/context/react-query-client';
import { useToast } from '@/hooks/core/use-toast';
import { ICourse } from '@/types';

import { Button } from '@/components/ui/buttons/button';
import { Checkbox } from '@/components/ui/buttons/checkbox';
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
import { Textarea } from '@/components/ui/form/textarea';
import Loader from '@/components/ui/info/loader';
import { Separator } from '@/components/ui/layout/separator';
import { useCourseMutation } from '@/hooks/mutations/useCourse.mutation';

const CreateCourseSchema = z.object({
  name: z.string().min(1, 'Course name is required'),
  description: z.string().min(1, 'Course description is required'),
  subject: z.string().min(1, 'Subject is required'),
  isPublished: z.boolean().default(false),
  createdById: z.string().optional(),
});

const UpdateCourseSchema = CreateCourseSchema.partial();

type CourseFormValues = {
  name: string;
  description: string;
  subject: string;
  isPublished: boolean;
  createdById?: string;
};

type HandleCourseFormProps =
  | {
    isEdit?: true;
    course: ICourse;
  }
  | { isEdit?: false; course: undefined };

const HandleCourseForm: React.FC<HandleCourseFormProps> = (props) => {
  const { toast } = useToast();
  const router = useRouter();

  const schema = props.isEdit ? UpdateCourseSchema : CreateCourseSchema;

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      subject: '',
      isPublished: false,
      createdById: '6822f239745f8d66b3bb670b',
    },
  });

  const courseMutation = useCourseMutation({
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });

      form.reset();

      toast({
        title: `Success ${response.statusCode} 🚀`,
        description: response.message,
      });

      setTimeout(() => {
        router.push('/dashboard/courses');
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

  const isLoading = courseMutation.status === 'pending';

  useEffect(() => {
    if (props.isEdit && props.course) {
      const formValues: CourseFormValues = {
        name: props.course.name,
        description: props.course.description,
        subject: props.course.subject,
        isPublished: props.course.isPublished,
        createdById: typeof props.course.createdById === 'object' ?
          props.course.createdById._id : props.course.createdById,
      };
      form.reset(formValues);
    }
  }, [props.course, props.isEdit, form]);

  const handleFormSubmit = async (data: CourseFormValues) => {
    if (props.isEdit) {
      courseMutation.updateCourse(props.course._id, data);
    } else {
      courseMutation.createCourse(data);
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập tên khóa học" {...field} />
                </FormControl>
                <FormDescription>
                  Vui lòng nhập tên khóa học.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Môn học</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập môn học" {...field} />
                </FormControl>
                <FormDescription>
                  Vui lòng nhập môn học của khóa học.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mô tả</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Nhập mô tả"
                    className="min-h-[150px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Cung cấp một mô tả chi tiết về khóa học.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Separator className="my-4" />
          <FormField
            control={form.control}
            name="isPublished"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Xuất bản
                  </FormLabel>
                  <FormDescription>
                    Đánh dấu hộp này để cho khóa học có sẵn cho học viên.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          <Button type="submit" disabled={!form.formState.isValid || isLoading}>
            {form.formState.isSubmitting || isLoading ? (
              <Loader type="ScaleLoader" height={20} color="#ffffff" />
            ) : (
              'Lưu khóa học'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default HandleCourseForm;
