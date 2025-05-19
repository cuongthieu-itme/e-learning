'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

import {
  CourseQueryType,
  useCourseQuery,
} from '@/hooks/queries/useCourse.query';

import DashboardCoursesList from '@/components/admin/dashboard/courses/DashboardCoursesList';
import SearchDashboardCourses from '@/components/admin/dashboard/courses/filters/SearchDashboardCourses';
import LoadingDashboardProducts from '@/components/shared/loading/dashboard/LoadingDashboardProducts';
import NotFound from '@/components/shared/NotFound';
import QueryParamController from '@/components/shared/QueryParamController';
import PaginateList from '@/components/ui/pagination/paginate-list';

const DashboardCourses: React.FC = () => {
  return (
    <Suspense fallback={<LoadingDashboardProducts />}>
      <DashboardCoursesContent />
    </Suspense>
  );
};

const DashboardCoursesContent: React.FC = () => {
  const searchParams = useSearchParams();

  const query = {
    page: Number(searchParams.get('page')) || 1,
    limit: Math.min(Math.max(Number(searchParams.get('limit')) || 10, 1), 100),
    search: searchParams.get('search') || '',
    sort: searchParams.get('sort') || '',
  };

  const { data, isLoading } = useCourseQuery({
    type: CourseQueryType.GET_ALL,
    params: { query },
  });

  if (isLoading) {
    return <LoadingDashboardProducts />;
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
