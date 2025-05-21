'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { queryClient } from '@/context/react-query-client';
import { useToast } from '@/hooks/core/use-toast';
import { LectureMutationType, useLectureMutation } from '@/hooks/mutations/useLecture.mutation';
import { ILecture } from '@/types/lecture.types';
import { LectureStatus } from '@/types/shared.types';

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

const CreateLectureSchema = z.object({
  courseId: z.string().min(1, 'Course ID is required'),
  createdById: z.string().min(1, 'Creator ID is required'),
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  outline: z.string().min(1, 'Outline is required'),
  pptxUrl: z.string().optional(),
  mindmapUrl: z.string().optional(),
  status: z.enum([LectureStatus.DRAFT, LectureStatus.PUBLISHED, LectureStatus.ARCHIVED]).default(LectureStatus.DRAFT),
});

const UpdateLectureSchema = CreateLectureSchema.partial();

type LectureFormValues = {
  courseId: string;
  createdById: string;
  title: string;
  content: string;
  outline: string;
  pptxUrl?: string;
  mindmapUrl?: string;
  status: LectureStatus;
};

type HandleLectureFormProps =
  | {
    isEdit?: true;
    lecture: ILecture;
  }
  | { isEdit?: false; lecture: undefined };

const HandleLectureForm: React.FC<HandleLectureFormProps> = (props) => {
  const { toast } = useToast();
  const router = useRouter();

  const schema = props.isEdit ? UpdateLectureSchema : CreateLectureSchema;

  const form = useForm<LectureFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      courseId: '682ad3dff69fbc18179a0062', // Default course ID as specified in the request
      createdById: '6822f239745f8d66b3bb670b', // Default creator ID as specified in the request
      title: '',
      content: '',
      outline: '',
      pptxUrl: '',
      mindmapUrl: '',
      status: LectureStatus.DRAFT,
    },
  });

  const lectureMutation = useLectureMutation({
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['lectures'] });

      form.reset();

      toast({
        title: `Success ${response.statusCode} 🚀`,
        description: response.message,
      });

      setTimeout(() => {
        router.push('/dashboard/lectures');
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

  const isLoading = lectureMutation.status === 'pending';

  useEffect(() => {
    if (props.isEdit && props.lecture) {
      const formValues: LectureFormValues = {
        courseId: typeof props.lecture.courseId === 'object' && '_id' in props.lecture.courseId 
          ? props.lecture.courseId._id 
          : String(props.lecture.courseId),
        createdById: typeof props.lecture.createdById === 'object' ? 
          props.lecture.createdById._id : props.lecture.createdById,
        title: props.lecture.title,
        content: props.lecture.content,
        outline: props.lecture.outline,
        pptxUrl: props.lecture.pptxUrl,
        mindmapUrl: props.lecture.mindmapUrl,
        status: props.lecture.status,
      };
      form.reset(formValues);
    }
  }, [props.lecture, props.isEdit, form]);

  const handleFormSubmit = async (data: LectureFormValues) => {
    if (props.isEdit) {
      lectureMutation.mutate({
        type: LectureMutationType.UPDATE,
        data: data as any,
        lectureId: props.lecture._id,
      });
    } else {
      lectureMutation.mutate({
        type: LectureMutationType.CREATE,
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
                  ID của khóa học mà bài giảng này thuộc về.
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
                  ID của người tạo bài giảng này.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tiêu đề</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập tiêu đề bài giảng" {...field} />
                </FormControl>
                <FormDescription>
                  Vui lòng nhập tiêu đề cho bài giảng.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nội dung</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Nhập nội dung bài giảng"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Mô tả chi tiết nội dung của bài giảng.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="outline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dàn ý</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Nhập dàn ý bài giảng"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Cấu trúc dàn ý của bài giảng.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pptxUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL Slide (PPTX)</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập đường dẫn đến file slide" {...field} />
                </FormControl>
                <FormDescription>
                  Đường dẫn đến file slide của bài giảng.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mindmapUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL Mindmap</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập đường dẫn đến file mindmap" {...field} />
                </FormControl>
                <FormDescription>
                  Đường dẫn đến file mindmap của bài giảng.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trạng thái</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={LectureStatus.DRAFT}>Bản nháp</SelectItem>
                    <SelectItem value={LectureStatus.PUBLISHED}>Đã xuất bản</SelectItem>
                    <SelectItem value={LectureStatus.ARCHIVED}>Đã lưu trữ</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Trạng thái của bài giảng.
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
              'Lưu bài giảng'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default HandleLectureForm;
