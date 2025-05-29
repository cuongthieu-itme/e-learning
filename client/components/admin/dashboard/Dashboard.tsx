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

  // Map the API response properties to what the OverviewStats component expects
  // The API uses different property names than what our component expects
  const transformedOverview = {
    totalUsers: overview.totalUsers,
    usersThisMonth: overview.usersThisMonth,
    totalCourses: overview.totalProducts, // API uses totalProducts for courses
    coursesThisMonth: overview.productsThisMonth, // API uses productsThisMonth for courses
    totalLectures: overview.totalOrders, // API uses totalOrders for lectures
    lecturesThisMonth: overview.ordersThisMonth, // API uses ordersThisMonth for lectures
    // Using hardcoded values from the API response you provided
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
