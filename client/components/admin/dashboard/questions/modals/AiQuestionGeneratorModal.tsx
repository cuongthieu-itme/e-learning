'use client';

import { Button } from '@/components/ui/buttons/button';
import { Input } from '@/components/ui/form/input';
import { Badge } from '@/components/ui/info/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/layout/card';
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

  // For preview and submission
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
          // Handle success for AI generation
          setGeneratedQuestions(data.questions);
          setStep('preview');
        } else if (questionMutation.variables?.type === QuestionMutationType.CREATE_BATCH) {
          // Handle success for batch creation
          toast({
            title: 'Thành công',
            description: `Đã tạo ${data.questionsCount || data.questions.length} câu hỏi thành công`,
          });
          if (onSuccess) {
            onSuccess(data.questions);
          }
          onOpenChange(false);
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

            <div className="flex-1 overflow-hidden pb-3 -mx-6 px-6">
              {generatedQuestions.length > 0 ? (
                <div className="flex h-full gap-4">
                  {/* Left sidebar - question list */}
                  <div className="w-[240px] border-r pr-4 h-full overflow-y-auto">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium">Danh sách câu hỏi</h3>
                      <span className="text-xs text-muted-foreground">{generatedQuestions.length} câu hỏi</span>
                    </div>
                    <div className="space-y-2">
                      {generatedQuestions.map((q, index) => (
                        <div
                          key={index}
                          className={cn(
                            "text-sm p-2 rounded border flex justify-between items-center cursor-pointer hover:bg-muted/50 transition-colors",
                            selectedQuestionIndex === index && "bg-muted border-primary/40"
                          )}
                          onClick={() => setSelectedQuestionIndex(index)}
                        >
                          <span className="line-clamp-2 flex-1 mr-2 text-xs">
                            {index + 1}. {q.question.substring(0, 40)}{q.question.length > 40 ? '...' : ''}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-70 hover:opacity-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveQuestion(index);
                            }}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Main content - question preview */}
                  <div className="flex-1 overflow-y-auto">
                    {generatedQuestions[selectedQuestionIndex] && (
                      <div className="space-y-6">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-base">Câu hỏi {selectedQuestionIndex + 1}</CardTitle>
                            <CardDescription>
                              {selectedLecture?.title}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <h4 className="font-medium mb-1.5">Câu hỏi:</h4>
                              <p className="text-sm">{generatedQuestions[selectedQuestionIndex].question}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <h4 className="font-medium mb-1.5 flex items-center gap-1.5">
                                  <span>A:</span>
                                  {generatedQuestions[selectedQuestionIndex].correctAnswer === 'A' && (
                                    <Badge variant="secondary" className="text-xs">Đáp án đúng</Badge>
                                  )}
                                </h4>
                                <p className="text-sm">{generatedQuestions[selectedQuestionIndex].optionA}</p>
                              </div>
                              <div>
                                <h4 className="font-medium mb-1.5 flex items-center gap-1.5">
                                  <span>B:</span>
                                  {generatedQuestions[selectedQuestionIndex].correctAnswer === 'B' && (
                                    <Badge variant="secondary" className="text-xs">Đáp án đúng</Badge>
                                  )}
                                </h4>
                                <p className="text-sm">{generatedQuestions[selectedQuestionIndex].optionB}</p>
                              </div>
                              <div>
                                <h4 className="font-medium mb-1.5 flex items-center gap-1.5">
                                  <span>C:</span>
                                  {generatedQuestions[selectedQuestionIndex].correctAnswer === 'C' && (
                                    <Badge variant="secondary" className="text-xs">Đáp án đúng</Badge>
                                  )}
                                </h4>
                                <p className="text-sm">{generatedQuestions[selectedQuestionIndex].optionC}</p>
                              </div>
                              <div>
                                <h4 className="font-medium mb-1.5 flex items-center gap-1.5">
                                  <span>D:</span>
                                  {generatedQuestions[selectedQuestionIndex].correctAnswer === 'D' && (
                                    <Badge variant="secondary" className="text-xs">Đáp án đúng</Badge>
                                  )}
                                </h4>
                                <p className="text-sm">{generatedQuestions[selectedQuestionIndex].optionD}</p>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-medium mb-1.5">Giải thích:</h4>
                              <p className="text-sm">{generatedQuestions[selectedQuestionIndex].explanation}</p>
                            </div>
                          </CardContent>
                        </Card>

                        <div className="flex justify-between">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedQuestionIndex(Math.max(0, selectedQuestionIndex - 1))}
                            disabled={selectedQuestionIndex === 0}
                          >
                            Câu trước
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedQuestionIndex(Math.min(generatedQuestions.length - 1, selectedQuestionIndex + 1))}
                            disabled={selectedQuestionIndex === generatedQuestions.length - 1}
                          >
                            Câu tiếp theo
                          </Button>
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
