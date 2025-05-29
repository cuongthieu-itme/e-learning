'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { queryClient } from '@/context/react-query-client';
import { useCurrentUser } from '@/hooks/auth/use-current-user';
import { useToast } from '@/hooks/core/use-toast';
import { LectureMutationType, useLectureMutation } from '@/hooks/mutations/useLecture.mutation';
import { CourseQueryType, useCourseQuery } from '@/hooks/queries/useCourse.query';
import { cn } from '@/lib/utils';
import { GetCoursesDto, ICourse } from '@/types';
import { ILecture } from '@/types/lecture.types';
import { LectureStatus } from '@/types/shared.types';
import debounce from 'lodash.debounce';

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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/layout/popover';
import { Separator } from '@/components/ui/layout/separator';
import { Check, ChevronsUpDown, Search } from 'lucide-react';

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
  const { user } = useCurrentUser();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [selectedCourse, setSelectedCourse] = useState<ICourse | null>(null);
  const [open, setOpen] = useState(false);

  const schema = props.isEdit ? UpdateLectureSchema : CreateLectureSchema;

  const form = useForm<LectureFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      courseId: '',
      createdById: user?.userId || '',
      title: '',
      content: '',
      outline: '',
      pptxUrl: '',
      mindmapUrl: '',
      status: LectureStatus.DRAFT,
    },
  });

  useEffect(() => {
    if (user?.userId && !form.getValues('createdById')) {
      form.setValue('createdById', user.userId);
    }
  }, [user, form]);

  useEffect(() => {
    if (props.isEdit && props.lecture) {
      const lectureData = props.lecture;

      const courseId = typeof lectureData.courseId === 'object' && '_id' in lectureData.courseId
        ? lectureData.courseId._id
        : String(lectureData.courseId);

      form.setValue('courseId', courseId);
      form.setValue('title', lectureData.title);
      form.setValue('content', lectureData.content);
      form.setValue('outline', lectureData.outline);
      form.setValue('pptxUrl', lectureData.pptxUrl || '');
      form.setValue('mindmapUrl', lectureData.mindmapUrl || '');
      form.setValue('status', lectureData.status);

      if (lectureData.createdById) {
        const createdById = typeof lectureData.createdById === 'object' && '_id' in lectureData.createdById
          ? lectureData.createdById._id
          : String(lectureData.createdById);
        form.setValue('createdById', createdById);
      }
    }
  }, [props.isEdit, props.lecture, form]);

  const lectureMutation = useLectureMutation({
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['lectures'] });

      form.reset();

      toast({
        title: `Thành công 🚀`,
        description: response.message,
      });

      setTimeout(() => {
        router.push('/dashboard/lectures');
      }, 1000);
    },
    onError: (error: any) => {
      toast({
        title: 'Lỗi',
        description: error?.response?.data?.message,
        variant: 'destructive',
      });
    },
  });

  const isLoading = lectureMutation.status === 'pending';

  const queryParams = useMemo<GetCoursesDto>(() => ({
    page,
    limit: 10,
    search: searchTerm,
    createdById: user?.userId,
  }), [page, searchTerm, user]);

  const { data: coursesData, isLoading: isCoursesLoading, refetch } = useCourseQuery({
    type: CourseQueryType.GET_ALL,
    params: { query: queryParams },
    enabled: open,
  });

  useEffect(() => {
    if (open && !coursesData) {
      refetch();
    }
  }, [open, coursesData, refetch]);

  const courses = useMemo<ICourse[]>(() => {
    return (coursesData?.courses || []) as ICourse[];
  }, [coursesData]);

  const totalPages = useMemo(() => coursesData?.totalPages || 1, [coursesData]);

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      if (value !== searchTerm) {
        setSearchTerm(value);
        setPage(1);

        if (!open) {
          setOpen(true);
        }

        refetch();
      }
    }, 800),
    [searchTerm, open, refetch],
  );

  const handleSearch = (value: string) => {
    debouncedSearch(value);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length === 0 || value.length > 1) {
      handleSearch(value);
    }
  };

  useEffect(() => {
    if (searchTerm && !open) {
      setOpen(true);
    }
  }, [searchTerm, open]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const isScrolledToBottom = scrollTop + clientHeight >= scrollHeight - 20;

    if (isScrolledToBottom && page < totalPages && !isCoursesLoading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const extractCourseId = useCallback((courseId: string | ICourse): string => {
    if (typeof courseId === 'object' && '_id' in courseId) {
      return courseId._id;
    }
    return String(courseId);
  }, []);

  useEffect(() => {
    if (props.isEdit && props.lecture) {
      if (courses.length > 0) {
        const courseId = extractCourseId(props.lecture.courseId as any);
        const course = courses.find(c => c._id === courseId);
        if (course) {
          setSelectedCourse(course);
        }
      }
    }
  }, [props.isEdit, props.lecture, courses, extractCourseId]);

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
              <FormItem className="flex flex-col">
                <FormLabel>ID Khóa học</FormLabel>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="justify-between w-full font-normal"
                      >
                        {field.value && selectedCourse
                          ? selectedCourse.name
                          : "Chọn khóa học"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 w-full min-w-[300px]" align="start">
                    <div className="bg-popover rounded-md overflow-hidden">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <input
                          placeholder="Tìm kiếm khóa học..."
                          onChange={handleSearchInputChange}
                          className="pl-8 pr-4 py-2 h-9 w-full border-b focus:outline-none"
                        />
                      </div>
                      <div
                        className="max-h-[300px] overflow-auto p-1"
                        onScroll={handleScroll}
                      >
                        {isCoursesLoading ? (
                          <div className="py-6 text-center">
                            <Loader type="ScaleLoader" height={20} />
                          </div>
                        ) : courses.length === 0 ? (
                          <div className="py-6 text-center text-sm text-muted-foreground">
                            Không tìm thấy khóa học nào
                          </div>
                        ) : (
                          <>
                            <div className="px-2 pb-1 pt-1 text-xs text-muted-foreground">
                              {courses.length} kết quả
                            </div>
                            <div className="space-y-1">
                              {courses.map((course) => (
                                <div
                                  key={course._id}
                                  className={cn(
                                    "flex items-center px-2 py-1.5 text-sm rounded-md gap-2 cursor-pointer hover:bg-accent",
                                    field.value === course._id ? "bg-accent" : ""
                                  )}
                                  onClick={() => {
                                    field.onChange(course._id);
                                    setSelectedCourse(course);
                                    setOpen(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "h-4 w-4",
                                      field.value === course._id ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  <div className="flex flex-col">
                                    <span className="font-medium">{course.name}</span>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {isCoursesLoading && page > 1 && (
                              <div className="py-2 text-center">
                                <Loader type="ScaleLoader" height={16} />
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  ID của khóa học mà bài giảng này thuộc về.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* <FormField
            control={form.control}
            name="createdById"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID Người tạo</FormLabel>
                <FormControl>
                  <Input
                    placeholder="ID của người tạo"
                    {...field}
                    disabled={true}
                    title="Tự động lấy từ người dùng đăng nhập"
                  />
                </FormControl>
                <FormDescription>
                  ID của người tạo bài giảng này (tự động lấy từ người dùng đang đăng nhập).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          /> */}
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
                    <SelectItem value={LectureStatus.PUBLISHED}>Xuất bản</SelectItem>
                    <SelectItem value={LectureStatus.ARCHIVED}>Lưu trữ</SelectItem>
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
