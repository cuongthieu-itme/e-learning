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
import { queryClient } from '@/context/react-query-client';
import { useCurrentUser } from '@/hooks/auth/use-current-user';
import { useToast } from '@/hooks/core/use-toast';
import { QuestionMutationType, useQuestionMutation } from '@/hooks/mutations/useQuestion.mutation';
import { LectureQueryType, useLectureQuery } from '@/hooks/queries/useLecture.query';
import { cn } from '@/lib/utils';
import { ILecture } from '@/types/lecture.types';
import { IQuestion } from '@/types/question.types';
import { zodResolver } from '@hookform/resolvers/zod';
import debounce from 'lodash.debounce';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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
  const { user } = useCurrentUser();

  const schema = props.isEdit ? UpdateQuestionSchema : CreateQuestionSchema;

  const form = useForm<QuestionFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      lectureId: '',
      createdById: user?.userId || '',
      question: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctAnswer: 'A',
      explanation: '',
    },
  });

  useEffect(() => {
    if (user?.userId && !form.getValues('createdById')) {
      form.setValue('createdById', user.userId);
    }
  }, [user, form]);

  const questionMutation = useQuestionMutation({
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });

      form.reset();

      toast({
        title: `Thành công 🚀`,
        description: response.message,
      });

      setTimeout(() => {
        router.push('/dashboard/questions');
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

  const isLoading = questionMutation.status === 'pending';

  const extractLectureId = useCallback((lectureId: string | ILecture): string => {
    if (typeof lectureId === 'object' && '_id' in lectureId) {
      return lectureId._id;
    }
    return String(lectureId);
  }, []);

  useEffect(() => {
    if (props.isEdit && props.question) {
      const formValues: QuestionFormValues = {
        lectureId: typeof props.question.lectureId === 'object' && '_id' in props.question.lectureId
          ? props.question.lectureId._id
          : String(props.question.lectureId),
        createdById: typeof props.question.createdById === 'object' && '_id' in props.question.createdById
          ? props.question.createdById._id
          : String(props.question.createdById),
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

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [selectedLecture, setSelectedLecture] = useState<ILecture | null>(null);
  const [open, setOpen] = useState(false);

  const queryParams = useMemo(() => ({
    page,
    limit: 10,
    search: searchTerm,
    createdById: user?.role === 'admin' ? undefined : user?.userId,
  }), [page, searchTerm, user]);

  const { data: lecturesData, isLoading: isLecturesLoading, refetch } = useLectureQuery({
    type: LectureQueryType.GET_ALL,
    params: { query: queryParams },
    enabled: open,
  });

  useEffect(() => {
    if (open && !lecturesData) {
      refetch();
    }
  }, [open, lecturesData, refetch]);

  const lectures = useMemo<ILecture[]>(() => {
    return (lecturesData?.lectures || []) as ILecture[];
  }, [lecturesData]);

  const totalPages = useMemo(() => {
    if (!lecturesData) return 1;
    return Math.ceil(lecturesData.totalLectures / queryParams.limit);
  }, [lecturesData, queryParams.limit]);

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

    if (isScrolledToBottom && page < totalPages && !isLecturesLoading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const lectureIdValue = form.watch("lectureId");

  useEffect(() => {
    if (open && lectureIdValue && !selectedLecture) {
      const lecture = lectures.find(l => l._id === lectureIdValue);
      if (lecture) {
        setSelectedLecture(lecture);
      }
    }
  }, [open, lectureIdValue, selectedLecture, lectures]);

  useEffect(() => {
    if (props.isEdit && props.question) {
      if (lectures.length > 0) {
        const lectureId = extractLectureId(props.question.lectureId as string);
        const lecture = lectures.find(l => l._id === lectureId);
        if (lecture) {
          setSelectedLecture(lecture);
        }
      }
    }
  }, [props.isEdit, props.question, lectures, extractLectureId]);

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
              <FormItem className="flex flex-col">
                <FormLabel>ID Bài giảng</FormLabel>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="justify-between w-full font-normal"
                      >
                        {field.value && selectedLecture
                          ? selectedLecture.title
                          : "Chọn bài giảng"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 w-full min-w-[300px]" align="start">
                    <div className="bg-popover rounded-md overflow-hidden">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <input
                          placeholder="Tìm kiếm bài giảng..."
                          onChange={handleSearchInputChange}
                          className="pl-8 pr-4 py-2 h-9 w-full border-b focus:outline-none"
                        />
                      </div>
                      <div
                        className="max-h-[300px] overflow-auto p-1"
                        onScroll={handleScroll}
                      >
                        {isLecturesLoading ? (
                          <div className="py-6 text-center">
                            <Loader type="ScaleLoader" height={20} />
                          </div>
                        ) : lectures.length === 0 ? (
                          <div className="py-6 text-center text-sm text-muted-foreground">
                            Không tìm thấy bài giảng nào
                          </div>
                        ) : (
                          <>
                            <div className="px-2 pb-1 pt-1 text-xs text-muted-foreground">
                              {lectures.length} kết quả
                            </div>
                            <div className="space-y-1">
                              {lectures.map((lecture) => (
                                <div
                                  key={lecture._id}
                                  className={cn(
                                    "flex items-center px-2 py-1.5 text-sm rounded-md gap-2 cursor-pointer hover:bg-accent",
                                    field.value === lecture._id ? "bg-accent" : ""
                                  )}
                                  onClick={() => {
                                    field.onChange(lecture._id);
                                    setSelectedLecture(lecture);
                                    setOpen(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "h-4 w-4",
                                      field.value === lecture._id ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  <div className="flex flex-col">
                                    <span className="font-medium">{lecture.title}</span>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {isLecturesLoading && page > 1 && (
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
                  ID của bài giảng mà câu hỏi này thuộc về.
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
                  ID của người tạo câu hỏi này (tự động lấy từ người dùng đang đăng nhập).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          /> */}
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
