'use client';

import { Button } from '@/components/ui/buttons/button';
import { Textarea } from '@/components/ui/form/textarea';
import { Badge } from '@/components/ui/info/badge';
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
import { LectureQueryType, useLectureQuery } from '@/hooks/queries/useLecture.query';
import { cn } from '@/lib/utils';
import { ILecture } from '@/types/lecture.types';
import debounce from 'lodash.debounce';
import { AlertCircle, BrainCircuit, Check, ChevronsUpDown, LightbulbIcon, Loader2, Search, Sparkles } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

type AiQuestionGeneratorModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerate: (lectureId: string, topic: string) => void;
};

const AiQuestionGeneratorModal: React.FC<AiQuestionGeneratorModalProps> = ({
  isOpen,
  onOpenChange,
  onGenerate,
}) => {
  const { user } = useCurrentUser();
  const [lectureId, setLectureId] = useState('');
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'input' | 'generating' | 'preview'>('input');

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [selectedLecture, setSelectedLecture] = useState<ILecture | null>(null);
  const [openLecturePopover, setOpenLecturePopover] = useState(false);

  const exampleTopics = [
    'Kiến thức cơ bản về hàm số',
    'Ứng dụng của vi phân trong kinh tế',
    'Lịch sử phát triển của ngôn ngữ lập trình'
  ];

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lectureId || !topic) return;

    setIsLoading(true);
    setStep('generating');

    setTimeout(() => {
      onGenerate(lectureId, topic);
    }, 1500);
  };

  const useSuggestion = (suggestion: string) => {
    setTopic(suggestion);
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
        setTopic('');
        setSelectedLecture(null);
        setSearchTerm('');
        setPage(1);
      }
      onOpenChange(open);
    }}>
      <DialogContent className="sm:max-w-[600px]">
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
              Nhập ID bài giảng và chủ đề để tạo câu hỏi tự động với trí tuệ nhân tạo
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
                  <label htmlFor="topic" className="text-sm font-medium flex items-center gap-1.5">
                    <span>Chủ đề câu hỏi</span>
                    <Badge variant="outline" className="text-xs font-normal">Bắt buộc</Badge>
                  </label>
                  <Textarea
                    id="topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Mô tả chi tiết về chủ đề câu hỏi bạn muốn tạo"
                    className="w-full min-h-24"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <LightbulbIcon className="h-4 w-4 text-amber-500" />
                  <span className="text-sm font-medium">Gợi ý chủ đề</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {exampleTopics.map((suggestion, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer hover:bg-secondary/80 transition-colors"
                      onClick={() => useSuggestion(suggestion)}
                    >
                      {suggestion}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="text-amber-800">
                  <p className="font-medium">Lưu ý:</p>
                  <p>Để có kết quả tốt nhất, hãy cung cấp mô tả chi tiết về chủ đề và phạm vi kiến thức của câu hỏi.</p>
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
                <p className="text-muted-foreground">AI đang xử lý yêu cầu của bạn, vui lòng đợi một chút</p>
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
              disabled={isLoading || !lectureId || !topic}
              className="gap-2"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isLoading ? 'Đang xử lý...' : 'Tạo câu hỏi'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AiQuestionGeneratorModal;
