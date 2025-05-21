import { Button } from '@/components/ui/buttons/button';
import { Badge } from '@/components/ui/info/badge';
import Loader from '@/components/ui/info/loader';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/layout/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/layout/dropdown-menu';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/utilities/table';
import { queryClient } from '@/context/react-query-client';
import { useToast } from '@/hooks/core/use-toast';
import { QuestionMutationType, useQuestionMutation } from '@/hooks/mutations/useQuestion.mutation';
import { IQuestion } from '@/types/question.types';
import { Delete, Edit, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
import QuestionDetailModal from './modals/QuestionDetailModal';

type DashboardQuestionsListProps = {
  questionsData: { questions: IQuestion[]; totalQuestions: number };
};

const DashboardQuestionsList: React.FC<DashboardQuestionsListProps> = ({
  questionsData,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>('');
  const [selectedQuestion, setSelectedQuestion] = useState<IQuestion | null>(null);
  const { toast } = useToast();

  const questionMutation = useQuestionMutation({
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });

      setIsDialogOpen(false);
      setSelectedQuestionId('');

      toast({
        title: `Success ${response.statusCode} 🚀`,
        description: response.message,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error?.response?.data?.message,
        variant: 'destructive',
      });
    },
  });

  return (
    <Table>
      <TableCaption>Danh sách câu hỏi</TableCaption>
      <TableHeader>
        <TableRow>
          {[
            '#',
            'Câu hỏi',
            'Đáp án đúng',
            'Hành động',
          ].map((header) => (
            <TableHead className="whitespace-nowrap" key={header}>
              {header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {questionsData.questions.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4}>Không tìm thấy câu hỏi</TableCell>
          </TableRow>
        ) : (
          questionsData.questions.map((question, index) => (
            <TableRow 
              className="whitespace-nowrap cursor-pointer hover:bg-gray-50" 
              key={question._id}
              onClick={() => {
                setSelectedQuestion(question);
                setIsDetailDialogOpen(true);
              }}
            >
              <TableCell className="max-w-[120px] truncate">{index + 1}</TableCell>
              <TableCell className="max-w-[300px] truncate">{question.question}</TableCell>
              <TableCell>
                <Badge variant="default">Đáp án {question.correctAnswer}</Badge>
              </TableCell>
              <TableCell onClick={(e) => e.stopPropagation()}>
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost">
                      <MoreHorizontal />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <Link href={`/dashboard/questions/${question._id}/edit`}>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Sửa
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem onSelect={() => {
                        setSelectedQuestionId(question._id);
                        setIsDialogOpen(true);
                      }}>
                        <Delete className="mr-2 h-4 w-4" />
                        Xóa
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Tổng</TableCell>
          <TableCell className="text-right">
            {questionsData.totalQuestions}
          </TableCell>
        </TableRow>
      </TableFooter>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa câu hỏi này?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="submit"
              variant="destructive"
              disabled={questionMutation.status === 'pending'}
              onClick={() =>
                questionMutation.mutate({
                  type: QuestionMutationType.DELETE,
                  questionId: selectedQuestionId,
                })
              }
            >
              {questionMutation.status === 'pending' ? (
                <Loader type="ScaleLoader" height={20} />
              ) : (
                'Xác nhận'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <QuestionDetailModal 
        isOpen={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
        question={selectedQuestion}
      />
    </Table>
  );
};

export default DashboardQuestionsList;
