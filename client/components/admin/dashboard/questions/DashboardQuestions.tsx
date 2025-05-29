'use client';

import DashboardQuestionsList from '@/components/admin/dashboard/questions/DashboardQuestionsList';
import SearchDashboardQuestions from '@/components/admin/dashboard/questions/filters/SearchDashboardQuestions';
import LoadingDashboardQuestions from '@/components/shared/loading/dashboard/LoadingDashboardQuestions';
import NotFound from '@/components/shared/NotFound';
import QueryParamController from '@/components/shared/QueryParamController';
import PaginateList from '@/components/ui/pagination/paginate-list';
import { useCurrentUser } from '@/hooks/auth/use-current-user';
import { QuestionQueryType, useQuestionQuery } from '@/hooks/queries/useQuestion.query';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

const DashboardQuestions: React.FC = () => {
  return (
    <Suspense fallback={<LoadingDashboardQuestions />}>
      <DashboardQuestionsContent />
    </Suspense>
  );
};

const DashboardQuestionsContent: React.FC = () => {
  const searchParams = useSearchParams();
  const { user } = useCurrentUser();

  const query = {
    page: Number(searchParams.get('page')) || 1,
    limit: Math.min(Math.max(Number(searchParams.get('limit')) || 10, 1), 100),
    search: searchParams.get('search') || '',
    sort: searchParams.get('sort') || '',
    createdById: user?.userId,
  };

  const { data, isLoading } = useQuestionQuery({
    type: QuestionQueryType.GET_ALL,
    params: { query },
  });

  if (isLoading) {
    return <LoadingDashboardQuestions />;
  }

  if (!data) {
    return <NotFound href="/dashboard" />;
  }

  const totalQuestions = data.totalQuestions;

  return (
    <div className="flex flex-col gap-5">
      <SearchDashboardQuestions />

      <DashboardQuestionsList questionsData={data} />

      {totalQuestions > query.limit && (
        <QueryParamController<string> paramKey="page" defaultValue="1">
          {({ value, onChange }) => (
            <PaginateList
              onPageChange={(value) => onChange(String(value))}
              totalItems={totalQuestions}
              itemsPerPage={query.limit}
              currentPage={Number(value)}
            />
          )}
        </QueryParamController>
      )}
    </div>
  );
};

export default DashboardQuestions;
