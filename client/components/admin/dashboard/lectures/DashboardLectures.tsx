'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

import DashboardLecturesList from '@/components/admin/dashboard/lectures/DashboardLecturesList';
import SearchDashboardLectures from '@/components/admin/dashboard/lectures/filters/SearchDashboardLectures';
import LoadingDashboardLectures from '@/components/shared/loading/dashboard/LoadingDashboardLectures';
import NotFound from '@/components/shared/NotFound';
import QueryParamController from '@/components/shared/QueryParamController';
import PaginateList from '@/components/ui/pagination/paginate-list';
import { useCurrentUser } from '@/hooks/auth/use-current-user';
import { LectureQueryType, useLectureQuery } from '@/hooks/queries/useLecture.query';

const DashboardLectures: React.FC = () => {
  return (
    <Suspense fallback={<LoadingDashboardLectures />}>
      <DashboardLecturesContent />
    </Suspense>
  );
};

const DashboardLecturesContent: React.FC = () => {
  const searchParams = useSearchParams();
  const { user } = useCurrentUser();

  const query = {
    page: Number(searchParams.get('page')) || 1,
    limit: Math.min(Math.max(Number(searchParams.get('limit')) || 10, 1), 100),
    search: searchParams.get('search') || '',
    sort: searchParams.get('sort') || '',
    createdById: user?.userId,
  };

  const { data, isLoading } = useLectureQuery({
    type: LectureQueryType.GET_ALL,
    params: { query },
  });

  if (isLoading) {
    return <LoadingDashboardLectures />;
  }

  if (!data) {
    return <NotFound href="/dashboard" />;
  }

  const totalLectures = data.totalLectures;

  return (
    <div className="flex flex-col gap-5">
      <SearchDashboardLectures />

      <DashboardLecturesList lecturesData={data} />

      {totalLectures > query.limit && (
        <QueryParamController<string> paramKey="page" defaultValue="1">
          {({ value, onChange }) => (
            <PaginateList
              onPageChange={(value) => onChange(String(value))}
              totalItems={totalLectures}
              itemsPerPage={query.limit}
              currentPage={Number(value)}
            />
          )}
        </QueryParamController>
      )}
    </div>
  );
};

export default DashboardLectures;
