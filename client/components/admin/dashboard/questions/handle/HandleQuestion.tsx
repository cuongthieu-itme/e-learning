'use client';

import { IQuestion } from '@/types/question.types';
import { useState } from 'react';

import HandleQuestionForm from '@/components/admin/dashboard/questions/forms/handle-question/HandleQuestionForm';
import AiQuestionGeneratorModal from '@/components/admin/dashboard/questions/modals/AiQuestionGeneratorModal';
import { Button } from '@/components/ui/buttons/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/layout/card';
import { Separator } from '@/components/ui/layout/separator';
import { BrainCircuit } from 'lucide-react';

type HandleQuestionProps =
  | {
    isEdit?: true;
    question: IQuestion;
  }
  | { isEdit?: false };

const HandleQuestion: React.FC<HandleQuestionProps> = (props) => {
  const formProps = props.isEdit
    ? { isEdit: true as const, question: props.question }
    : { isEdit: false as const, question: undefined };

  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const handleQuestionSuccess = (questions: any[]) => {
    setIsAiModalOpen(false);
  };

  return (
    <>
      <Card className="h-full shadow-none">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>{props.isEdit ? 'Sửa' : 'Thêm'} câu hỏi</CardTitle>
            <CardDescription>
              {props.isEdit
                ? 'Sửa câu hỏi'
                : 'Thêm câu hỏi mới'}
            </CardDescription>
          </div>
          {!props.isEdit && (
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => setIsAiModalOpen(true)}
            >
              <BrainCircuit className="h-4 w-4" />
              Tạo câu hỏi bằng AI
            </Button>
          )}
        </CardHeader>
        <Separator />
        <CardContent className="pt-5">
          <HandleQuestionForm {...formProps} />
        </CardContent>
      </Card>

      <AiQuestionGeneratorModal
        isOpen={isAiModalOpen}
        onOpenChange={setIsAiModalOpen}
        onSuccess={handleQuestionSuccess}
      />
    </>
  );
};

export default HandleQuestion;
