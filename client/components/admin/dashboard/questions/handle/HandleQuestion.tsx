'use client';

import { IQuestion } from '@/types/question.types';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/layout/card';
import { Separator } from '@/components/ui/layout/separator';
import HandleQuestionForm from '@/components/admin/dashboard/questions/forms/handle-question/HandleQuestionForm';

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

  return (
    <Card className="h-full shadow-none">
      <CardHeader>
        <CardTitle>{props.isEdit ? 'Sửa' : 'Thêm'} câu hỏi</CardTitle>
        <CardDescription>
          {props.isEdit
            ? 'Sửa câu hỏi'
            : 'Thêm câu hỏi mới'}
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="pt-5">
        <HandleQuestionForm {...formProps} />
      </CardContent>
    </Card>
  );
};

export default HandleQuestion;
