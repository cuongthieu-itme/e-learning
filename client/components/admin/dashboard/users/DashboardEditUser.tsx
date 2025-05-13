'use client';

import HandleUser from '@/components/admin/dashboard/users/handle/HandleUser';
import { UserQueryType, useUserQuery } from '@/hooks/queries/useUser.query';

type DashboardEditUserProps = {
  userId: string;
};

const DashboardEditUser: React.FC<DashboardEditUserProps> = ({
  userId,
}) => {
  const { data, isLoading } = useUserQuery({
    type: UserQueryType.GET_ONE,
    params: { userId },
  });

  if (isLoading) {
    return 'Loading...';
  }

  if (!data?.user) {
    return 'No user found';
  }

  return <HandleUser isEdit={true} user={data?.user} />;
};

export default DashboardEditUser;
