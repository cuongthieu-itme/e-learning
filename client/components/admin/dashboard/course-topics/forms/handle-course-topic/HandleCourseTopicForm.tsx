'use client';

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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/layout/popover';
import { Separator } from '@/components/ui/layout/separator';
import { queryClient } from '@/context/react-query-client';
import { useToast } from '@/hooks/core/use-toast';
import { CourseTopicMutationType, useCourseTopicMutation } from '@/hooks/mutations/useCourseTopic.mutation';
import { CourseQueryType, useCourseQuery } from '@/hooks/queries/useCourse.query';
import { cn } from '@/lib/utils';
import { GetCoursesDto, ICourse } from '@/types';
import { ICourseTopic } from '@/types/course-topic.types';
import { zodResolver } from '@hookform/resolvers/zod';
import debounce from 'lodash.debounce';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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

  const extractCourseId = useCallback((courseId: string | ICourse): string => {
    if (typeof courseId === 'object' && '_id' in courseId) {
      return courseId._id;
    }
    return String(courseId);
  }, []);

  const schema = props.isEdit ? UpdateCourseTopicSchema : CreateCourseTopicSchema;

  const form = useForm<CourseTopicFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      courseId: '',
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
        courseId: typeof props.courseTopic.courseId === 'string'
          ? props.courseTopic.courseId
          : props.courseTopic.courseId._id,
        topic: props.courseTopic.topic,
      };
      form.reset(formValues);
    }
  }, [props.courseTopic, props.isEdit, form, extractCourseId]);

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

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [selectedCourse, setSelectedCourse] = useState<ICourse | null>(null);
  const [open, setOpen] = useState(false);

  const queryParams = useMemo<GetCoursesDto>(() => ({
    page,
    limit: 10,
    search: searchTerm,
  }), [page, searchTerm]);

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

  // Effects that need to react to field value but can't be inside the render prop
  const courseIdValue = form.watch("courseId");

  // Effect for updating selectedCourse when courseId changes
  useEffect(() => {
    if (open && courseIdValue && !selectedCourse) {
      const course = courses.find(c => c._id === courseIdValue);
      if (course) {
        setSelectedCourse(course);
      }
    }
  }, [open, courseIdValue, selectedCourse, courses]);

  // Effect for handling edit mode course selection
  useEffect(() => {
    if (props.isEdit && props.courseTopic) {
      if (courses.length > 0) {
        const courseId = extractCourseId(props.courseTopic.courseId as string);
        const course = courses.find(c => c._id === courseId);
        if (course) {
          setSelectedCourse(course);
        }
      }
    }
  }, [props.isEdit, props.courseTopic, courses, extractCourseId]);

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
                          ? `${selectedCourse.name} (${field.value})`
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
                                    <span className="text-xs text-muted-foreground">{course._id}</span>
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
