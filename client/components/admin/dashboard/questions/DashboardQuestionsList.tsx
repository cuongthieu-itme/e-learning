import { Delete, Edit, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';

import { queryClient } from '@/context/react-query-client';
import { useToast } from '@/hooks/core/use-toast';

import Loader from '@/components/ui/info/loader';

import { Button } from '@/components/ui/buttons/button';
import { Badge } from '@/components/ui/info/badge';
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
import { QuestionMutationType, useQuestionMutation } from '@/hooks/mutations/useQuestion.mutation';
import { IQuestion } from '@/types/question.types';

type DashboardQuestionsListProps = {
  questionsData: { questions: IQuestion[]; totalQuestions: number };
};

const DashboardQuestionsList: React.FC<DashboardQuestionsListProps> = ({
  questionsData,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>('');
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
      <TableCaption>A list of your questions</TableCaption>
      <TableHeader>
        <TableRow>
          {[
            'ID',
            'Question',
            'Correct Answer',
            'Actions',
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
            <TableCell colSpan={4}>No questions found</TableCell>
          </TableRow>
        ) : (
          questionsData.questions.map((question) => (
            <TableRow className="whitespace-nowrap" key={question._id}>
              <TableCell className="max-w-[120px] truncate">{question._id}</TableCell>
              <TableCell className="max-w-[300px] truncate">{question.question}</TableCell>
              <TableCell>
                <Badge variant="default">Option {question.correctAnswer}</Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost">
                      <MoreHorizontal />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <Link href={`/dashboard/questions/${question._id}/edit`}>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Question
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem onSelect={() => {
                        setSelectedQuestionId(question._id);
                        setIsDialogOpen(true);
                      }}>
                        <Delete className="mr-2 h-4 w-4" />
                        Delete Question
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
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">
            {questionsData.totalQuestions}
          </TableCell>
        </TableRow>
      </TableFooter>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Question</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Are you sure you want to
              permanently delete this question from server?
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
                'Confirm'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Table>
  );
};

export default DashboardQuestionsList;
