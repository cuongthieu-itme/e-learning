import Loader from '@/components/ui/info/loader';
import React from 'react';

const LoadingDashboardUsers: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-5">
      <Loader type="ScaleLoader" height={50} />
      <p className="text-lg font-semibold">Đang tải người dùng...</p>
    </div>
  );
};

export default LoadingDashboardUsers;
