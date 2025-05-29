'use client';

import LoadingDashboard from '@/components/shared/loading/dashboard/LoadingDashboard';
import NotFound from '@/components/shared/NotFound';
import {
  AnalyticsQueryType,
  useAnalyticsQuery,
} from '@/hooks/queries/useAnalytics.query';
import CourseMetrics from './components/CourseMetrics';
import LectureMetrics from './components/LectureMetrics';
import OverviewStats from './components/OverviewStats';
import QuestionMetrics from './components/QuestionMetrics';
import UserMetrics from './components/UserMetrics';

const Dashboard: React.FC = () => {
  const { data, isLoading } = useAnalyticsQuery({
    type: AnalyticsQueryType.GET_ANALYTICS,
  });

  if (isLoading) {
    return <LoadingDashboard />;
  }

  if (!data) {
    return <NotFound href="/dashboard" />;
  }

  const { overview, userMetrics, courseMetrics, lectureMetrics, questionMetrics } = data.data;

  const transformedOverview = {
    totalUsers: overview.totalUsers,
    usersThisMonth: overview.usersThisMonth,
    totalCourses: overview.totalProducts,
    coursesThisMonth: overview.productsThisMonth,
    totalLectures: overview.totalOrders,
    lecturesThisMonth: overview.ordersThisMonth,
    totalQuestions: 4,
    questionsThisMonth: 4
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      <OverviewStats data={transformedOverview} />

      <div className="grid grid-cols-2 gap-6 max-xl:grid-cols-1">
        <UserMetrics data={userMetrics} />

        <CourseMetrics data={courseMetrics} />

        <LectureMetrics data={lectureMetrics} />

        <QuestionMetrics data={questionMetrics} />
      </div>
    </div>
  );
};

export default Dashboard;
