'use client';

import HandleQuestion from '@/components/admin/dashboard/questions/handle/HandleQuestion';

import {
  QuestionQueryType,
  useQuestionQuery,
} from '@/hooks/queries/useQuestion.query';

type DashboardEditQuestionProps = {
  questionId: string;
};

const DashboardEditQuestion: React.FC<DashboardEditQuestionProps> = ({
  questionId,
}) => {
  const { data, isLoading } = useQuestionQuery({
    type: QuestionQueryType.GET_ONE,
    params: { questionId: questionId },
  });

  if (isLoading) {
    return 'Loading...';
  }

  if (!data || !data.question) {
    return 'Không tìm thấy câu hỏi';
  }

  return <HandleQuestion isEdit={true} question={data.question} />;
};

export default DashboardEditQuestion;
