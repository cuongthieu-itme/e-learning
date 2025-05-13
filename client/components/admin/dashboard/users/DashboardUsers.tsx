'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

import {
  UserQueryType,
  useUserQuery,
} from '@/hooks/queries/useUser.query';

import DashboardUsersList from '@/components/admin/dashboard/users/DashboardUsersList';
import SearchDashboardUsers from '@/components/admin/dashboard/users/filters/SearchDashboardUsers';
import LoadingDashboardUsers from '@/components/shared/loading/dashboard/LoadingDashboardUsers';
import NotFound from '@/components/shared/NotFound';
import QueryParamController from '@/components/shared/QueryParamController';
import PaginateList from '@/components/ui/pagination/paginate-list';

const DashboardUsers: React.FC = () => {
  return (
    <Suspense fallback={<LoadingDashboardUsers />}>
      <DashboardUsersContent />
    </Suspense>
  );
};

const DashboardUsersContent: React.FC = () => {
  const searchParams = useSearchParams();

  const query = {
    page: Number(searchParams.get('page')) || 1,
    limit: Math.min(Math.max(Number(searchParams.get('limit')) || 10, 1), 100),
    search: searchParams.get('search') || '',
    sort: searchParams.get('sort') || '',
  };

  const { data, isLoading } = useUserQuery({
    type: UserQueryType.GET_ALL,
    params: { query },
  });

  if (isLoading) {
    return <LoadingDashboardUsers />;
  }

  if (!data) {
    return <NotFound href="/dashboard" />;
  }

  const totalUsers = data.totalUsers;

  return (
    <div className="flex flex-col gap-5">
      <SearchDashboardUsers />

      <DashboardUsersList usersData={data} />

      {totalUsers > query.limit && (
        <QueryParamController<string> paramKey="page" defaultValue="1">
          {({ value, onChange }) => (
            <PaginateList
              onPageChange={(value) => onChange(String(value))}
              totalItems={totalUsers}
              itemsPerPage={query.limit}
              currentPage={Number(value)}
            />
          )}
        </QueryParamController>
      )}
    </div>
  );
};

export default DashboardUsers;
