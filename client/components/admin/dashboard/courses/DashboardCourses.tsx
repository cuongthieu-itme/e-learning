'use client';

import LoadingDashboardCourses from '@/components/shared/loading/dashboard/LoadingDashboardCourses';
import NotFound from '@/components/shared/NotFound';
import QueryParamController from '@/components/shared/QueryParamController';
import PaginateList from '@/components/ui/pagination/paginate-list';
import { useCurrentUser } from '@/hooks/auth/use-current-user';
import { CourseQueryType, useCourseQuery } from '@/hooks/queries/useCourse.query';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import DashboardCoursesList from './DashboardCoursesList';
import SearchDashboardCourses from './filters/SearchDashboardCourses';

const DashboardCourses: React.FC = () => {
  return (
    <Suspense fallback={<LoadingDashboardCourses />}>
      <DashboardCoursesContent />
    </Suspense>
  );
};

const DashboardCoursesContent: React.FC = () => {
  const searchParams = useSearchParams();
  const { user } = useCurrentUser();

  const query = {
    page: Number(searchParams.get('page')) || 1,
    limit: Math.min(Math.max(Number(searchParams.get('limit')) || 10, 1), 100),
    search: searchParams.get('search') || '',
    sort: searchParams.get('sort') || '',
    createdById: user?.userId,
  };

  const { data, isLoading } = useCourseQuery({
    type: CourseQueryType.GET_ALL,
    params: { query },
  });

  if (isLoading) {
    return <LoadingDashboardCourses />;
  }

  if (!data) {
    return <NotFound href="/dashboard" />;
  }

  const totalCourses = data.totalCourses;

  return (
    <div className="flex flex-col gap-5">
      <SearchDashboardCourses />

      <DashboardCoursesList coursesData={data} />

      {totalCourses > query.limit && (
        <QueryParamController<string> paramKey="page" defaultValue="1">
          {({ value, onChange }) => (
            <PaginateList
              onPageChange={(value) => onChange(String(value))}
              totalItems={totalCourses}
              itemsPerPage={query.limit}
              currentPage={Number(value)}
            />
          )}
        </QueryParamController>
      )}
    </div>
  );
};

export default DashboardCourses;
