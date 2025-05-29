'use client';

import { Button } from '@/components/ui/buttons/button';
import { Input } from '@/components/ui/form/input';
import { Badge } from '@/components/ui/info/badge';
import { Card, CardContent } from '@/components/ui/layout/card';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/layout/command';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/layout/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/layout/popover';
import { Separator } from '@/components/ui/layout/separator';
import { useCurrentUser } from '@/hooks/auth/use-current-user';
import { useToast } from '@/hooks/core/use-toast';
import { QuestionMutationType, useQuestionMutation } from '@/hooks/mutations/useQuestion.mutation';
import { LectureQueryType, useLectureQuery } from '@/hooks/queries/useLecture.query';
import { cn } from '@/lib/utils';
import { ILecture } from '@/types/lecture.types';
import debounce from 'lodash.debounce';
import { AlertCircle, BrainCircuit, Check, ChevronsUpDown, Database, Loader2, Search, Sparkles, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

type AiQuestionGeneratorModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (questions: any[]) => void;
};

const AiQuestionGeneratorModal: React.FC<AiQuestionGeneratorModalProps> = ({
  isOpen,
  onOpenChange,
  onSuccess,
}) => {
  const router = useRouter();
  const { user } = useCurrentUser();
  const { toast } = useToast();
  const [lectureId, setLectureId] = useState('');
  const [count, setCount] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'input' | 'generating' | 'preview'>('input');

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [selectedLecture, setSelectedLecture] = useState<ILecture | null>(null);
  const [openLecturePopover, setOpenLecturePopover] = useState(false);

  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);

  const queryParams = useMemo(() => ({
    page,
    limit: 10,
    search: searchTerm,
    createdById: user?.role === 'admin' ? undefined : user?.userId,
  }), [page, searchTerm, user]);

  const { data: lecturesData, isLoading: isLecturesLoading, refetch } = useLectureQuery({
    type: LectureQueryType.GET_ALL,
    params: { query: queryParams },
    enabled: openLecturePopover,
  });

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

        if (!openLecturePopover) {
          setOpenLecturePopover(true);
        }

        refetch();
      }
    }, 800),
    [searchTerm, openLecturePopover, refetch],
  );

  const handleSearch = (value: string) => {
    debouncedSearch(value);
  };
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const isScrolledToBottom = scrollTop + clientHeight >= scrollHeight - 20;

    if (isScrolledToBottom && page < totalPages && !isLecturesLoading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const questionMutation = useQuestionMutation({
    onSuccess: (data) => {
      setIsLoading(false);

      if (data?.questions) {
        if (questionMutation.variables?.type === QuestionMutationType.GENERATE_AI) {
          setGeneratedQuestions(data.questions);
          setStep('preview');
        } else if (questionMutation.variables?.type === QuestionMutationType.CREATE_BATCH) {
          toast({
            title: 'Thành công',
            description: `Đã tạo ${data.questionsCount || data.questions.length} câu hỏi thành công`,
          });
          if (onSuccess) {
            onSuccess(data.questions);
          }
          onOpenChange(false);
          router.push('/dashboard/questions');
        }
      }
    },
    onError: (error: any) => {
      setIsLoading(false);
      setStep('input');
      toast({
        title: 'Lỗi',
        description: error?.message || 'Đã xảy ra lỗi khi xử lý yêu cầu',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lectureId || !selectedLecture) return;

    setIsLoading(true);
    setStep('generating');

    questionMutation.mutate({
      type: QuestionMutationType.GENERATE_AI,
      data: {
        lectureId,
        lecture: selectedLecture.title,
        count,
      },
    });
  };

  const handleSaveQuestions = () => {
    if (generatedQuestions.length === 0) return;

    setIsLoading(true);

    questionMutation.mutate({
      type: QuestionMutationType.CREATE_BATCH,
      data: {
        questions: generatedQuestions
      },
    });
  };

  const handleRemoveQuestion = (index: number) => {
    const newQuestions = [...generatedQuestions];
    newQuestions.splice(index, 1);
    setGeneratedQuestions(newQuestions);

    if (selectedQuestionIndex >= newQuestions.length) {
      setSelectedQuestionIndex(Math.max(0, newQuestions.length - 1));
    }
  };

  const handleSelectLecture = (lecture: ILecture) => {
    setSelectedLecture(lecture);
    setLectureId(lecture._id);
    setOpenLecturePopover(false);
  };

  useEffect(() => {
    if (openLecturePopover && !lecturesData) {
      refetch();
    }
  }, [openLecturePopover, lecturesData, refetch]);

  useEffect(() => {
    if (searchTerm && !openLecturePopover) {
      setOpenLecturePopover(true);
    }
  }, [searchTerm, openLecturePopover]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        setStep('input');
        setIsLoading(false);
        setLectureId('');
        setCount(5);
        setSelectedLecture(null);
        setSearchTerm('');
        setPage(1);
        setGeneratedQuestions([]);
        setSelectedQuestionIndex(0);
      }
      onOpenChange(open);
    }}>
      <DialogContent className={cn(
        "sm:max-w-[600px]",
        step === 'preview' && "sm:max-w-[900px] h-[80vh]"
      )}>
        {step !== 'preview' && (
          <form onSubmit={handleSubmit}>
            <DialogHeader className="space-y-3">
              <DialogTitle className="flex items-center gap-2 text-xl">
                <div className="relative">
                  <BrainCircuit className="h-6 w-6 text-primary" />
                  <Sparkles className="absolute -right-1 -top-1 h-3 w-3 text-amber-500" />
                </div>
                Tạo câu hỏi bằng AI
              </DialogTitle>
              <DialogDescription className="text-base">
                Nhập thông tin để tạo câu hỏi tự động với trí tuệ nhân tạo
              </DialogDescription>
              <Separator />
            </DialogHeader>

            {step === 'input' && (
              <div className="space-y-6 py-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="lectureId" className="text-sm font-medium flex items-center gap-1.5">
                      <span>Bài giảng</span>
                      <Badge variant="outline" className="text-xs font-normal">Bắt buộc</Badge>
                    </label>
                    <Popover open={openLecturePopover} onOpenChange={setOpenLecturePopover}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openLecturePopover}
                          className="justify-between w-full font-normal"
                        >
                          {lectureId && selectedLecture
                            ? selectedLecture.title
                            : "Chọn bài giảng"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0 w-full min-w-[300px]" align="start">
                        <Command>
                          <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <CommandInput
                              placeholder="Tìm kiếm bài giảng..."
                              className="pl-8"
                              onValueChange={handleSearch}
                            />
                          </div>
                          <CommandList className="max-h-[300px] overflow-auto" onScroll={handleScroll}>
                            <CommandEmpty className="py-6 text-center text-sm">
                              {isLecturesLoading ? (
                                <div className="flex justify-center items-center">
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Đang tải...
                                </div>
                              ) : (
                                "Không tìm thấy bài giảng nào"
                              )}
                            </CommandEmpty>
                            <CommandGroup>
                              {lectures.map((lecture) => (
                                <CommandItem
                                  key={lecture._id}
                                  value={lecture._id}
                                  onSelect={() => handleSelectLecture(lecture)}
                                  className="flex items-center justify-between py-2"
                                >
                                  <div className="flex flex-col">
                                    <span>{lecture.title}</span>
                                  </div>
                                  {lectureId === lecture._id && (
                                    <Check className="h-4 w-4 text-primary" />
                                  )}
                                </CommandItem>
                              ))}
                              {isLecturesLoading && (
                                <div className="flex justify-center items-center py-2">
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Đang tải thêm...
                                </div>
                              )}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="count" className="text-sm font-medium flex items-center gap-1.5">
                      <span>Số lượng câu hỏi</span>
                      <Badge variant="outline" className="text-xs font-normal">Bắt buộc</Badge>
                    </label>
                    <Input
                      id="count"
                      type="number"
                      min={1}
                      max={20}
                      value={count}
                      onChange={(e) => setCount(parseInt(e.target.value) || 5)}
                      className="w-full"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 'generating' && (
              <div className="py-8 flex flex-col items-center justify-center space-y-4">
                <div className="relative">
                  <Loader2 className="h-10 w-10 text-primary animate-spin" />
                  <Sparkles className="absolute right-0 top-0 h-4 w-4 text-amber-500" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="font-medium text-lg">Đang tạo câu hỏi...</h3>
                  <p className="text-muted-foreground">AI đang xử lý yêu cầu của bạn, quá trình này có thể mất từ 30 giây đến 1 phút</p>
                </div>
              </div>
            )}

            <DialogFooter className={cn("gap-2", step === 'generating' && "hidden")}>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Hủy
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={isLoading || !lectureId || !selectedLecture}
                className="gap-2"
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                {isLoading ? 'Đang xử lý...' : 'Tạo câu hỏi'}
              </Button>
            </DialogFooter>
          </form>)}

        {step === 'preview' && (
          <div className="flex flex-col h-full">
            <DialogHeader className="space-y-3">
              <DialogTitle className="flex items-center gap-2 text-xl">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="h-6 w-6 text-primary" />
                  <span>Xem trước câu hỏi</span>
                </div>
              </DialogTitle>
              <DialogDescription className="text-base">
                Xem trước và chỉnh sửa các câu hỏi được tạo bởi AI trước khi lưu
              </DialogDescription>
              <Separator />
            </DialogHeader>

            <div className="flex-1 overflow-hidden pb-3">
              {generatedQuestions.length > 0 ? (
                <div className="flex h-full gap-3">
                  {/* Left sidebar - question list */}
                  <div className="w-[220px] border-r pr-3 h-full overflow-y-auto py-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold">Danh sách câu hỏi</h3>
                      <Badge variant="secondary" className="text-xs">{generatedQuestions.length} câu</Badge>
                    </div>
                    <div className="space-y-1.5">
                      {generatedQuestions.map((q, index) => (
                        <div
                          key={index}
                          className={cn(
                            "text-sm p-2 rounded-md border flex justify-between items-center cursor-pointer transition-all",
                            selectedQuestionIndex === index
                              ? "bg-primary/10 border-primary text-primary font-medium shadow-sm"
                              : "hover:bg-muted/70 border-muted-foreground/20"
                          )}
                          onClick={() => setSelectedQuestionIndex(index)}
                        >
                          <span className="line-clamp-2 flex-1 mr-1.5 text-xs">
                            <span className="font-medium mr-1">#{index + 1}</span>
                            {q.question.substring(0, 30)}{q.question.length > 30 ? '...' : ''}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 opacity-70 hover:opacity-100 hover:text-destructive flex-shrink-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveQuestion(index);
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto pr-1">
                    {generatedQuestions[selectedQuestionIndex] && (
                      <div className="space-y-4">
                        <Card className="shadow-sm border-muted-foreground/20 overflow-hidden mt-1">
                          <div className="bg-primary/5 px-4 py-3 border-b">
                            <div className="flex items-center justify-between gap-2">
                              <h3 className="font-semibold text-base">Câu hỏi #{selectedQuestionIndex + 1}</h3>
                              <Badge
                                variant="outline"
                                className="bg-background/80 backdrop-blur-sm text-xs truncate max-w-[180px]"
                              >
                                {selectedLecture?.title}
                              </Badge>
                            </div>
                          </div>
                          <CardContent className="space-y-4 p-4">
                            <div className="space-y-1.5">
                              <h4 className="font-medium text-sm text-muted-foreground">Câu hỏi:</h4>
                              <p className="text-base font-medium">{generatedQuestions[selectedQuestionIndex].question}</p>
                            </div>

                            <Separator />

                            <div className="grid grid-cols-2 gap-3">
                              {['A', 'B', 'C', 'D'].map((option) => {
                                const isCorrect = generatedQuestions[selectedQuestionIndex].correctAnswer === option;
                                const optionKey = `option${option}` as 'optionA' | 'optionB' | 'optionC' | 'optionD';
                                return (
                                  <div
                                    key={option}
                                    className={cn(
                                      "p-2.5 border rounded-lg relative",
                                      isCorrect && "border-green-500/50 bg-green-50/50 dark:bg-green-950/10"
                                    )}
                                  >
                                    <div className={cn(
                                      "absolute -left-1 -top-1 size-4 rounded-full flex items-center justify-center text-xs font-medium",
                                      isCorrect
                                        ? "bg-green-500 text-white"
                                        : "bg-muted-foreground/20 text-muted-foreground"
                                    )}>
                                      {option}
                                    </div>
                                    <p className={cn(
                                      "text-sm pt-0.5 pl-2.5",
                                      isCorrect && "font-medium"
                                    )}>
                                      {generatedQuestions[selectedQuestionIndex][optionKey]}
                                    </p>
                                    {isCorrect && (
                                      <div className="absolute -right-1 -top-1">
                                        <Badge variant="default" className="bg-green-500 text-[10px] px-1.5 py-0 h-4">
                                          <Check className="mr-0.5 h-2.5 w-2.5" />
                                          Đúng
                                        </Badge>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>

                            <Separator />

                            <div className="space-y-1.5 bg-muted/30 p-2.5 rounded-md">
                              <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-1.5">
                                <AlertCircle className="h-3.5 w-3.5" />
                                Giải thích:
                              </h4>
                              <p className="text-sm">{generatedQuestions[selectedQuestionIndex].explanation}</p>
                            </div>
                          </CardContent>
                        </Card>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedQuestionIndex(Math.max(0, selectedQuestionIndex - 1))}
                              disabled={selectedQuestionIndex === 0}
                              className="h-7 gap-1 px-2"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5"><path d="m15 18-6-6 6-6" /></svg>
                              Câu trước
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedQuestionIndex(Math.min(generatedQuestions.length - 1, selectedQuestionIndex + 1))}
                              disabled={selectedQuestionIndex === generatedQuestions.length - 1}
                              className="h-7 gap-1 px-2"
                            >
                              Câu tiếp theo
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5"><path d="m9 18 6-6-6-6" /></svg>
                            </Button>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {selectedQuestionIndex + 1} / {generatedQuestions.length}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p>Không có câu hỏi nào để hiển thị</p>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="gap-2 pt-2 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setStep('input');
                  setGeneratedQuestions([]);
                }}
              >
                Quay lại
              </Button>
              <Button
                type="button"
                className="gap-2"
                disabled={generatedQuestions.length === 0 || isLoading}
                onClick={handleSaveQuestions}
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                <Database className="h-4 w-4 mr-1" />
                {isLoading ? 'Đang lưu...' : 'Lưu câu hỏi'}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AiQuestionGeneratorModal;
