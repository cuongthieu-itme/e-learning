'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';


import SearchDashboardCourseTopics from '@/components/admin/dashboard/course-topics/filters/SearchDashboardCourseTopics';
import LoadingDashboardCourseTopics from '@/components/shared/loading/dashboard/LoadingDashboardCourseTopics';
import NotFound from '@/components/shared/NotFound';
import QueryParamController from '@/components/shared/QueryParamController';
import PaginateList from '@/components/ui/pagination/paginate-list';
import { CourseTopicQueryType, useCourseTopicQuery } from '@/hooks/queries/useCourseTopic.query';
import DashboardCourseTopicsList from './DashboardCourseTopicsList';

const DashboardCourseTopics: React.FC = () => {
  return (
    <Suspense fallback={<LoadingDashboardCourseTopics />}>
      <DashboardCourseTopicsContent />
    </Suspense>
  );
};

const DashboardCourseTopicsContent: React.FC = () => {
  const searchParams = useSearchParams();

  const query = {
    page: Number(searchParams.get('page')) || 1,
    limit: Math.min(Math.max(Number(searchParams.get('limit')) || 10, 1), 100),
    search: searchParams.get('search') || '',
    sort: searchParams.get('sort') || '',
  };

  const { data, isLoading } = useCourseTopicQuery({
    type: CourseTopicQueryType.GET_ALL,
    params: { query },
  });

  if (isLoading) {
    return <LoadingDashboardCourseTopics />;
  }

  if (!data) {
    return <NotFound href="/dashboard" />;
  }

  const totalCourseTopics = data.totalCourseTopics;

  return (
    <div className="flex flex-col gap-5">
      <SearchDashboardCourseTopics />

      <DashboardCourseTopicsList courseTopicsData={data} />

      {totalCourseTopics > query.limit && (
        <QueryParamController<string> paramKey="page" defaultValue="1">
          {({ value, onChange }) => (
            <PaginateList
              onPageChange={(value) => onChange(String(value))}
              totalItems={totalCourseTopics}
              itemsPerPage={query.limit}
              currentPage={Number(value)}
            />
          )}
        </QueryParamController>
      )}
    </div>
  );
};

export default DashboardCourseTopics;
